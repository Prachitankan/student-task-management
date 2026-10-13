export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const priorityClass = `priority-${task.priority?.toLowerCase() || 'medium'}`;

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-left">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, task.completed)}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="task-details">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-meta">
            <span className="task-subject">{task.subject || 'General'}</span>
            {task.dueDate && (
              <span className="task-due-date">
                📅 {task.dueDate}
              </span>
            )}
            <span className={`task-priority ${priorityClass}`}>
              {task.priority || 'Medium'}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-delete"
        onClick={() => onDelete(task.id)}
        title="Delete Task"
      >
        Delete
      </button>
    </div>
  );
}
