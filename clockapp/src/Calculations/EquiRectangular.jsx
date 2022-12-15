/**
 * 
 * @param { [longitude, latitude]} vertex 
 * @returns coordinates on rectangular projection. Coordinates are in [0, 1].
 * Coordinates represents vector from upper left corner.
 */
export const projectVertex = (vertex) => {
    console.log("EquiRectangular.jsx projectVertex(vertex) vertex:", vertex);
    const x = (vertex[0] + 180) / 360;
    const y = (-vertex[1] + 90) / 180;
    console.log("EquiRectangular.jsx projectVertex(vertex) projected:", [x, y]);
    const normalizedProjection = normalize([x, y]);
    console.log("EquiRectangular.jsx projectVertex(vertex) normalizedProjection:", normalizedProjection);
    return normalizedProjection;
}
const normalize = (vertex) => {
    const min = 0, max = 1, shift = 0.5;
    let x = vertex[0];
    let y = vertex[1];
    
    while (y >= 2)
        y -= 2;
    if (1 < y) {
        y = 1 - (y - 1);
        x += 0.5;
    }
    while (y < -1)
        y += 2;
    if (y < 0) {
        y = Math.abs(y);
        x += 0.5;
    }
    while (x > 1)
        x -= 1;
    while (x < 0)
        x += 1;
    return [x, y];
}
export const projectVertices = (vertices) => {
    return vertices.map(projectVertex);
}