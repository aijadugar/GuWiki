# GPT Model
import json, pickle, math
import torch
import torch.nn as nn
from torch.nn import functional as F
from app.config import meta_path, config_path

with open(config_path) as f:
    cfg = json.load(f)
cfg["bias"] = False

with open(meta_path, "rb") as f:
    meta = pickle.load(f)
vocab_size = meta["vocab_size"]

class CausalSelfAttention(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        assert cfg["n_embd"] % cfg["n_head"] == 0

        self.n_head = cfg["n_head"]
        self.n_embd = cfg["n_embd"]

        self.c_attn = nn.Linear(
            cfg["n_embd"],
            3 * cfg["n_embd"],
            bias=cfg["bias"]
        )

        self.c_proj = nn.Linear(
            cfg["n_embd"],
            cfg["n_embd"],
            bias=cfg["bias"]
        )

        self.attn_drop = nn.Dropout(cfg["dropout"])
        self.resid_drop = nn.Dropout(cfg["dropout"])

        self.register_buffer(
            "mask",
            torch.tril(
                torch.ones(
                    cfg["block_size"],
                    cfg["block_size"]
                )
            ).view(
                1,
                1,
                cfg["block_size"],
                cfg["block_size"]
            )
        )

    def forward(self, x):
        B, T, C = x.size()
        q, k, v = self.c_attn(x).split(self.n_embd, dim=2)
        hs = C // self.n_head

        q = q.view(B, T, self.n_head, hs).transpose(1, 2)
        k = k.view(B, T, self.n_head, hs).transpose(1, 2)
        v = v.view(B, T, self.n_head, hs).transpose(1, 2)

        att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(hs))

        att = att.masked_fill(
            self.mask[:, :, :T, :T] == 0,
            float("-inf")
        )

        att = F.softmax(att, dim=-1)
        att = self.attn_drop(att)
        y = (att @ v).transpose(1, 2).contiguous().view(B, T, C)
        return self.resid_drop(self.c_proj(y))


class MLP(nn.Module):
    def __init__(self, cfg):
        super().__init__()

        self.fc1 = nn.Linear(
            cfg["n_embd"],
            4 * cfg["n_embd"],
            bias=cfg["bias"]
        )

        self.gelu = nn.GELU()

        self.fc2 = nn.Linear(
            4 * cfg["n_embd"],
            cfg["n_embd"],
            bias=cfg["bias"]
        )

        self.drop = nn.Dropout(cfg["dropout"])

    def forward(self, x):
        return self.drop(
            self.fc2(
                self.gelu(
                    self.fc1(x)
                )
            )
        )


class Block(nn.Module):
    def __init__(self, cfg):
        super().__init__()

        self.ln1 = nn.LayerNorm(
            cfg["n_embd"],
            bias=cfg["bias"]
        )

        self.attn = CausalSelfAttention(cfg)

        self.ln2 = nn.LayerNorm(
            cfg["n_embd"],
            bias=cfg["bias"]
        )

        self.mlp = MLP(cfg)

    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x

class GPT(nn.Module):
    def __init__(self, cfg):
        super().__init__()

        self.cfg = cfg
        self.block_size = cfg["block_size"]

        self.transformer = nn.ModuleDict(dict(

            wte = nn.Embedding(
                vocab_size,
                cfg["n_embd"]
            ),

            wpe = nn.Embedding(
                cfg["block_size"],
                cfg["n_embd"]
            ),

            drop = nn.Dropout(cfg["dropout"]),

            h = nn.ModuleList([
                Block(cfg)
                for _ in range(cfg["n_layer"])
            ]),

            ln_f = nn.LayerNorm(
                cfg["n_embd"],
                bias=cfg["bias"]
            ),
        ))

        self.lm_head = nn.Linear(
            cfg["n_embd"],
            vocab_size,
            bias=False
        )

        self.transformer.wte.weight = self.lm_head.weight

        self.apply(self._init_weights)

    def _init_weights(self, module):
        if isinstance(module, nn.Linear):

            nn.init.normal_(
                module.weight,
                mean=0.0,
                std=0.02
            )

            if module.bias is not None:
                nn.init.zeros_(module.bias)

        elif isinstance(module, nn.Embedding):
            nn.init.normal_(
                module.weight,
                mean=0.0,
                std=0.02
            )

    def forward(self, idx, targets=None):
        B, T = idx.size()

        pos = torch.arange(0, T, device=idx.device)

        x = self.transformer.drop(
            self.transformer.wte(idx)
            + self.transformer.wpe(pos)
        )

        for block in self.transformer.h:
            x = block(x)

        x = self.transformer.ln_f(x)

        logits = self.lm_head(x)

        loss = None

        if targets is not None:

            loss = F.cross_entropy(
                logits.view(-1, logits.size(-1)),
                targets.view(-1)
            )

        return logits, loss

    @torch.no_grad()
    def generate(
        self,
        idx,
        max_new_tokens,
        temperature=0.8,
        top_k=40
    ):

        for _ in range(max_new_tokens):
            idx_cond = idx[:, -self.block_size:]

            logits, _ = self(idx_cond)

            logits = logits[:, -1, :] / temperature

            if top_k is not None:

                v, _ = torch.topk(
                    logits,
                    min(top_k, logits.size(-1))
                )

                logits[logits < v[:, [-1]]] = -float("Inf")

            probs = F.softmax(logits, dim=-1)

            idx_next = torch.multinomial(
                probs,
                num_samples=1
            )

            idx = torch.cat((idx, idx_next), dim=1)

        return idx

    def num_parameters(self):

        return sum(
            p.numel()
            for p in self.parameters()
        )