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

openai.api_key = 'sk-abcdefg'
client = openai.OpenAI()

random.seed(42)

PROMPT = '''You are an exam writer. You are now writing a knowledge test. You are given a question (Question) regarding an image and its standard solution (Solution), your task is to write free response questions that test on individual knowledge required in answering the question correctly. 

You should follow these steps to complete the task:
1. explicity analyze the given image, Question, and Solution
2. explicity list out the individual knowledge concepts required to reach Solution. 
3. write free response questions to test on the definition of each concept listed. Your generated questions should not include details of the given Question. Note that you need to provide answer keys to these questions too. 
4. format the free response questions in json format:
[
    {{
        question:
        answer:
    }}
]
Question: {question}
Solution: {answer}
'''

def encode_image(image):
    image = image.convert("RGB")
    output_buffer = BytesIO()
    image.save(output_buffer, format="PNG")
    byte_data = output_buffer.getvalue()
    base64_str = base64.b64encode(byte_data).decode("utf-8")
    return base64_str
    
def load_jsonl(file_path):
    with open(file_path) as f: f = f.readlines()
    data = [json.loads(line) for line in f]
    temp = []
    for row in data:
        for i in range(len(row['questions'])):
            temp.append({'id': f"{row['id']}_{i}", 'question': row['questions'][i]['question'], 'answer': row['questions'][i]['answer']})

def get_questions(image, question, answer):
    prompt = PROMPT.format(question=question, answer=answer)
    image = encode_image(image)
    try:
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image}"
                    }
                }
            ]
        }]
        response = client.chat.completions.create(
            model='gpt-4o',
            messages=messages,
            top_p=1,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        print("Unable to generate ChatCompletion response")
        print(f"Exception: {e}")
        return e
    
def get_mmmu_questions():
    dataset_name = 'MMMU/MMMU'
    configs = get_dataset_config_names(dataset_name)
    dataset = [load_dataset(dataset_name, configs[i], split='validation') for i in range(len(configs))]
    dataset = concatenate_datasets(dataset)
    dataset = list(dataset)
    dataset = [row for row in dataset if row['explanation'] != '']
    random.shuffle(dataset)
    dataset = dataset[:54]
    for row in dataset:
        res = get_questions(row['image_1'], row['question'], row['explanation'])
        json_pattern = r'\[.*?\]'
        matches = re.findall(json_pattern, res, re.DOTALL)
        for match in matches:
            try:
                parsed = json.loads(match)
                if isinstance(parsed, list):
                    #print(row['id'])
                    with open('mmmu_questions.jsonl','a') as f:
                        f.write(json.dumps({'id': row['id'], 'questions': parsed})+'\n')
                    break
            except Exception as e: print(e)
    load_jsonl('mmmu_questions.jsonl')
get_mmmu_questions()

def get_visualpuzzles_questions():
    dataset_name = 'neulab/VisualPuzzles'
    dataset = list(load_dataset(dataset_name)['train'])
    random.shuffle(dataset)
    dataset = dataset[:50]
    for row in dataset:
        res = get_questions(row['image'], row['question'], row['answer'])
        json_pattern = r'\[.*?\]'
        matches = re.findall(json_pattern, res, re.DOTALL)
        for match in matches:
            try:
                parsed = json.loads(match)
                if isinstance(parsed, list):
                    print(row['id'], parsed)
                    with open('puzzle_questions.jsonl','a') as f:
                        f.write(json.dumps({'id': row['id'], 'questions': parsed})+'\n')
                    break
            except Exception as e: print(e)
    load_jsonl('puzzle_questions.jsonl')
get_visualpuzzles_questions()
