export const getSmallest = (items, evaluator) => {
    if (items.length == 0)
        return null;

    let smallest = items[0];
    let minimum = evaluator(smallest);
    let current;
    for (var i = 1; i < items.length; i++) {
        current = evaluator(items[i]);
        if (current < minimum) {
            smallest = items[i];
            minimum = current;
        }
    }
    return smallest;
}
export const removeItem = (items, item) => {
    for (let i = 0; i < items.length; i++) {
        if (items[i] === item) {
            items.splice(i, 1);
            break;
        }
    }
}