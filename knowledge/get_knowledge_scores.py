import random
import openai
from datasets import (
    get_dataset_config_names,
    load_dataset,
    concatenate_datasets
)
import re
import json
import base64
from PIL import Image
from io import BytesIO
import os

client = openai.OpenAI()

JUDGE_RULES = """You are an evaluator assessing whether a model's answer demonstrates sufficient knowledge to correctly address a question. Your task is to output 1 if the answer reflects appropriate understanding, or 0 otherwise.

# Input
Question:
{question}

Ground Truth Answer:
{answer}

Model Prediction:
{pred}

# Evaluation Criteria
- Output 1 if the prediction demonstrates sufficient knowledge to answer the question, even if the wording or reasoning differs from the ground truth.
- Output 0 if the prediction shows misunderstanding, lacks essential knowledge, or is incorrect.
- Ignore superficial differences in phrasing, explanation style, capitalization, or formatting.

# Output Format
Respond with a single number: 0 or 1
"""
def get_eval(question, answer, pred):
    try:
        messages=[{"role": "user", "content": JUDGE_RULES.format(question=question,answer=answer,pred=pred)}]
        response = client.chat.completions.create(
            model='gpt-4o',
            messages=messages,
            top_p=1,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except: return 1


def get_knowledge_scores(response_file, output_file):
    if os.path.exists(output_file): 
        print(f"{output_file} exists!")
        return
    with open(response_file) as f: f = f.readlines()
    print(len(f))
    responses = []
    for line in f:
        temp = json.loads(line)
        id = '_'.join(temp['id'].split('_')[:-1])
        if id not in [row['id'] for row in responses]:
            responses.append({'id': id, 'questions': []})
        for row in responses:
            if row['id'] == id:
                row['questions'].append({'question': temp['question'], 'answer': temp['answer'], 'pred': temp['resps'][0]})
    with open('puzzle_questions.json') as f: data = json.load(f)
    if 'mmmu' not in output_file: # a few visualpuzzles questions does not have a corresponding knowledge checklist
        for row in data:
            if len(row['questions']) == 0: responses.append({'id': row['id'], 'questions': []})
    #print(len(responses))
    output = []
    for row in responses:
        pairs = row['questions']
        out = []
        overall = 1
        for pair in pairs:
            question = pair['question']
            answer = pair['answer']
            pred = pair['pred']
            eval = get_eval(question, answer, pred)
            if '1' in eval: score = 1
            else: 
                score = 0
                overall = 0
            #print(score)
            out.append({'question': question, 'answer': answer, 'pred': pred, 'eval': eval, 'score': score})
        out = {'id': row['id'], 'pairs': out, 'overall': overall}
        print(row['id'], overall)
        output.append(out)
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
# change the name of the response and output files
get_knowledge_scores('example_response.jsonl', 'example_output.jsonl')
