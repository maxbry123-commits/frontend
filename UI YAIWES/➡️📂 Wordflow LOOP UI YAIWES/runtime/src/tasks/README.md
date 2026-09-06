# runtime/src/tasks

Tasks específicas del Wordflow UI YAIWES ejecutadas por Stabilize.

Previstas:
- `question_task.py`
- `goal_task.py`
- `requirement_task.py`
- `plan_task.py`
- `agent_task.py`
- `audit_task.py`
- `strategy_delta_task.py`
- `consolidator_task.py`
- `coverage_task.py`
- `final_judge_task.py`

Regla: cada task recibe contrato tipado, produce resultado tipado y no escribe estado global saltándose Validator/Judge.
