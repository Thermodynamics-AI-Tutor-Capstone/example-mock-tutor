import { saveLesson } from '../whiteboard.js';

export function available(ctx) {
  return Boolean(ctx?.conversationId && ctx?.userId);
}

export default async function run(args, ctx) {
  if (ctx.boardShown) return { error: 'A board was already shown in this reply. Continue teaching from it.' };
  try {
    const board = await saveLesson(args, ctx);
    ctx.boardShown = true;
    return {
      figure: '```kelvin-board\n' + JSON.stringify(board) + '\n```',
      lessonId: board.lesson.id,
      how_to_show: 'The app has shown a narrated whiteboard with Play and Next step controls. Do not repeat the board or transcript. Ask one short question at the current help level. Audio plays only when the student presses Play; captions work without voice setup.',
    };
  } catch (error) {
    return { error: error.message };
  }
}
