export class ManyKeysWeakMap<K extends object, V> {
  /**
   * Removes the specified element from the WeakMap.
   * @returns true if the element was successfully removed, or false if it was not present.
   */
  delete(key: K[]): boolean;
  /**
   * @returns a specified element.
   */
  get(key: K[]): V | undefined;
  /**
   * @returns a boolean indicating whether an element with the specified key exists or not.
   */
  has(key: K[]): boolean;
  /**
   * Adds a new element with a specified key and value.
   * @param key Must be an object.
   */
  set(key: K[], value: V): this;
}
