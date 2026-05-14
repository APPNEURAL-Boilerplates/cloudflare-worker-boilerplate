export async function sendQueueMessage<T>(queue: Queue<T>, message: T): Promise<void> {
  await queue.send(message);
}
