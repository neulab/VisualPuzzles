# Knowledge Intensity Evaluation of MMMU v.s. VisualPuzzles

This experiment investigates 
- the extent to which solving problems in the VisualPuzzles benchmark relies on domain-specific knowledge, compared to the widely-used MMMU dataset; and
- whether models already possess the knowledge required to solve VisualPuzzles, as compared to MMMU.

## Experiments

### Knowledge Checklist Generation

We prompted GPT-4o to generate "knowledge concept checklists" for 50 randomly selected questions from each of MMMU and VisualPuzzles.

The knowledge concept checklists we generated could be found in [mmmu_questions.json](mmmu_questions.json) and [puzzle_questions.json](puzzle_questions.json).

Run the following command to reproduce this experiment.
```bash
python get_knowledge_checklists.py
```
Note that we went through manual validation as dicussed in the [paper](https://arxiv.org/pdf/2504.10342).
