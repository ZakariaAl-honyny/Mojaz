import os
import shutil

base_path = r'c:\Users\ALlahabi\Desktop\cmder\Mojaz\src\frontend\src\app\(employee)'
target_base = os.path.join(base_path, 'employee')

dirs_to_move = [
    'security',
    'licenses',
    'management',
    'practical-results',
    'training'
]

if not os.path.exists(target_base):
    os.makedirs(target_base)

for d in dirs_to_move:
    src = os.path.join(base_path, d)
    dst = os.path.join(target_base, d)
    
    if os.path.exists(src):
        print(f"Moving {src} to {dst}")
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.move(src, dst)
    else:
        print(f"Source {src} does not exist")
