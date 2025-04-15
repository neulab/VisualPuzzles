# Knowledge Intensity Evaluation of MMMU v.s. VisualPuzzles

This experiment investigates 
- the extent to which solving problems in the VisualPuzzles benchmark relies on domain-specific knowledge, compared to the widely-used MMMU dataset; and
- whether models already possess the knowledge required to solve VisualPuzzles, as compared to MMMU.

## Experiments

### Knowledge Checklist Generation

We prompted GPT-4o to generate "knowledge concept checklists" for 50 randomly selected questions from each of MMMU and VisualPuzzles.

The knowledge concept checklists we generated for MMMU and VisualPuzzles could be found in [mmmu_questions.json](mmmu_questions.json) and [puzzle_questions.json](puzzle_questions.json) respectively.

Run the following command to reproduce this experiment.
```bash
python get_knowledge_checklists.py
```
Note that we went through manual validation as dicussed in the [paper](https://arxiv.org/pdf/2504.10342).

### Knowledge Accuracy

We measured models' knowledge accuracy - their ability to answer the knowledge checklist questions correctly - on both benchmarks. We used llm-as-a-judge with GPT-4o to evaluate whether models answered the knowledge checklist questions correctly. Model outputs and judge outputs could be found in [knowledge_eval_output](knowledge_eval_output).

After generating model responses for the knowledge checklist questions [mmmu_questions.json](mmmu_questions.json) and [puzzle_questions.json](puzzle_questions.json), run the following command to reproduce this experiment on models' knowledge accuracy.
```bash
python get_knowledge_scores.py
```
