# VisualPuzzles: Decoupling Multimodal Reasoning Evaluation from Domain Knowledge

[![arXiv](https://img.shields.io/badge/arXiv-2504.10342-b31b1b.svg)](https://arxiv.org/abs/2504.10342) [![PDF](https://img.shields.io/badge/pdf-2504.10342-b31b1b.svg)](https://arxiv.org/pdf/2504.10342) [![HuggingFace Datasets](https://img.shields.io/badge/HuggingFace-Dataset-orange)](https://huggingface.co/datasets/neulab/VisualPuzzles) [![Project Website](https://img.shields.io/badge/GitHub-Website-blue)](https://neulab.github.io/VisualPuzzles)

## Overview
**VisualPuzzles** is a multimodal benchmark specifically designed to evaluate **reasoning abilities** in large models while deliberately minimizing reliance on domain-specific knowledge.

Key features:
- 1168 diverse puzzles
- 5 reasoning categories: Algorithmic, Analogical, Deductive, Inductive, Spatial
- Difficulty labels: Easy, Medium, Hard
- Less knowledge-intensive than existing benchmarks (e.g., MMMU)
- More reasoning-complex than existing benchmarks (e.g., MMMU)

## Key Findings
- All models perform worse than humans; most can't surpass even 5th-percentile human performance.
- Strong performance on knowledge-heavy benchmarks does not transfer well.
- Larger models and structured "thinking modes" don't guarantee better results.
- Scaling model size does not ensure stronger reasoning

## Dataset
The dataset is available on [HuggingFace 🤗](https://huggingface.co/datasets/neulab/VisualPuzzles).

## Citation
```bibtex
@misc{song2025visualpuzzlesdecouplingmultimodalreasoning,
  title={VisualPuzzles: Decoupling Multimodal Reasoning Evaluation from Domain Knowledge},
  author={Yueqi Song and Tianyue Ou and Yibo Kong and Zecheng Li and Graham Neubig and Xiang Yue},
  year={2025},
  eprint={2504.10342},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2504.10342}
}
```

## Acknowledgements
This project was supported in part by a grant from DSTA Singapore and the Carnegie Bosch Institute. The authors would like to thank CMU NeuLab colleagues for their constructive comments. The authors would also like to thank all volunteers who participated in the human evaluation.
