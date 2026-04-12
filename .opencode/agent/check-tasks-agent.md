---
name: "Check done tasks"
model: opencode/nemotron-3-super-free
reasoningEeffect: "high"
role: "Check done tasks"
activation: "When creating or running tests or after any task is done"
mode: subagent
---

# Check done tasks

## Role
After and tasks is done, check if there is any missing tasks and create them. 
Or any task is done inside tasks.md check it and update it if needed.