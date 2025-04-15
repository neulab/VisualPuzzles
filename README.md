# VisualPuzzles: Decoupling Multimodal Reasoning Evaluation from Domain Knowledge

[![arXiv](https://img.shields.io/badge/arXiv-2504.10342-b31b1b.svg)](https://arxiv.org/abs/2504.10342) [![PDF](https://img.shields.io/badge/pdf-2504.10342-b31b1b.svg)](https://arxiv.org/pdf/2504.10342) [![HuggingFace Datasets](https://img.shields.io/badge/HuggingFace-Dataset-orange)](https://huggingface.co/datasets/neulab/VisualPuzzles) [![Zeno Model Outputs](https://img.shields.io/badge/Zeno-Model_Outputs-purple)](https://hub.zenoml.com/project/2e727b03-a677-451a-b714-f2c07ad2b49f/VisualPuzzles) [![Project Website](https://img.shields.io/badge/GitHub-Website-blue)](https://neulab.github.io/VisualPuzzles)

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

## Model Outputs
Outputs of all models we evaluated are available on [Zeno](https://hub.zenoml.com/project/2e727b03-a677-451a-b714-f2c07ad2b49f/VisualPuzzles).

## Experiments

## Knowledge Intensity Evaluation of MMMU v.s. VisualPuzzles

This experiment investigates 
- the extent to which solving problems in the VisualPuzzles benchmark relies on domain-specific knowledge, compared to the widely-used MMMU dataset; and
- whether models already possess the knowledge required to solve VisualPuzzles, as compared to MMMU.

### Knowledge Checklist Generation

We prompted GPT-4o to generate "knowledge concept checklists" for 50 randomly selected questions from each of MMMU and VisualPuzzles.

The knowledge concept checklists we generated for MMMU and VisualPuzzles could be found in [knowledge/mmmu_questions.json](knowledge/mmmu_questions.json) and [knowledge/puzzle_questions.json](knowledge/puzzle_questions.json) respectively.

Run the following command to reproduce this experiment.
```bash
python get_knowledge_checklists.py
```
Note that we went through manual validation as dicussed in the [paper](https://arxiv.org/pdf/2504.10342).

### Knowledge Accuracy

We measured models' knowledge accuracy - their ability to answer the knowledge checklist questions correctly - on both benchmarks. We used llm-as-a-judge with GPT-4o to evaluate whether models answered the knowledge checklist questions correctly. Model outputs and judge outputs could be found in [knowledge/knowledge_eval_output](knowledge/knowledge_eval_output).

After generating model responses for the knowledge checklist questions [knowledge/mmmu_questions.json](knowledge/mmmu_questions.json) and [knowledge/puzzle_questions.json](puzzle_questions.json), run the following command to reproduce this experiment on models' knowledge accuracy.
```bash
python get_knowledge_scores.py
```

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
