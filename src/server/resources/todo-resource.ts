import { expressResource } from '@epandco/unthink-foundation-express';
import { data, DataResult, RouteContext } from '@epandco/unthink-foundation';
import { Todo } from '../model/todo';


let nextId = 0;
const todos = new Map<string, Todo>();

const genericErrorResult = DataResult.error({
  type: 'system',
  message: 'failed to update todo.'
});

async function getTodos(): Promise<DataResult> {
  return DataResult.ok(Array.from(todos.values()));
}

async function createTodo(ctx: RouteContext): Promise<DataResult> {
  // TODO: constructor of Todo needs to sanitize this input and return a clean instance
  const model = new Todo(ctx.body as Todo);

  model.id = (nextId++).toString();
  todos.set(model.id, model);

  return DataResult.ok(model.id);
}

async function updateTodo(ctx: RouteContext): Promise<DataResult> {
  const id = ctx.params?.todoId;
  if (!id || !todos.has(id)) {
    return DataResult.notFound();
  }

  const currentModel = todos.get(id);
  if (!currentModel) {
    ctx.logger.error(`${id} exists in the todos map but their is not instance stored with it`);
    return genericErrorResult;
  }

  const model = new Todo(ctx.body as Todo);

  currentModel.title = model.title;
  currentModel.complete = model.complete;

  return DataResult.noResult();
}

async function deleteTodo(ctx: RouteContext): Promise<DataResult> {
  const id = ctx.params?.todoId;
  if (!id || !todos.has(id)) {
    return DataResult.notFound();
  }

  if (!todos.delete(id)) {
    ctx.logger.error(`${id} exists in the todos map but could not be deleted`);
    return genericErrorResult;
  }

  return DataResult.noResult();
}

export default expressResource({
  name: 'todo-app',
  routes: [
    data('/todo', { 'get': getTodos, 'post': createTodo, }),
    data('/todo/:todoId', { 'put': updateTodo, 'delete': deleteTodo })
  ]
});