// ============================================================================================= PART 1: BOOSTRAP  ============================================================================================= //

// Token gerado para uso no MAPBOX-GL
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

// === POSIÇÃO INICIAL NO MAPA === //
//home = [-47.926063, -15.841060];
home = [-48.543123, -22.758396];

var coordinatesLongLat;
var initialPosition = [];
var longestEdgeLongLat;
var farthestVertexLongLat;
var selectedPosition;

var finalDestination = [];
var initialFinalPath = [];
var initialPath = [];
var ultimatePath = [];
var idFinalPath = 0;

// cropper
var cropper;

// Criando um objeto mapa
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    zoom: 15,
    center: home, // Longitude e latitude
    preserveDrawingBuffer: true
});


// Adicionando um marcador no ponto KML importados
var marcador = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(home)
    .addTo(map);

marcador.__proto__.display = true;

// ========= FERRAMENTA DE BUSCA POR LOCALIDADES =========== //

// Adicionando o controle de busca ao mapa.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

// Adicionando controles de zoom e rotação no mapa
map.addControl(new mapboxgl.NavigationControl());

// ========== DESENHANDO POLÍGONO ============= //

// Criando um objeto para desenho do polígono
// Apenas duas opções de controle estão habilitadas: polígono e lixeira
var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    },
    defaultMode: 'draw_polygon'
});

map.addControl(draw); // Adicionando o controle de desenho ao mapa

map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

// Pode-se selecionar a posição inicial da rota ao clicar em um dos vértices da área
map.on('click', selectInitialPosition);
map.on('touchstart', selectInitialPosition);

// ==== ALERTA ==== //

var alert = document.getElementById("alert");
var alertMessage = document.getElementById("alert-message");

// ============================================================================================= PART 2: DRAWING ROUTE  ============================================================================================= //

function updateArea(e) {

    data = draw.getAll();
    coordinatesLongLat = data.features[0].geometry.coordinates[0];

    //longestEdgeLongLat = longestEdge(coordinatesLongLat);
    longestEdgeLongLat = longestEdge(coordinatesLongLat);
    farthestVertexLongLat = farthestVertex(coordinatesLongLat, longestEdgeLongLat);

    var answer = document.getElementById('calculated-area');

    if (data.features.length > 0) {
        area = turf.area(data);

        // Área em hectares
        var rounded_area = (Math.round(area * 100) / 100) / 10000;
        answer.innerHTML = rounded_area.toFixed(2) + ' ha';

    } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
            alert('Use as ferramentas para desenhar um polígono!');
    }
}

// == VERIFICA A MAIOR ARESTA DO POLÍGONO == //
// == A MAIOR ARESTA DEFINE O SENTIDO DA ORIENTAÇÃO DO MOVIMENTO VAI-E-VOLTA == //
var longestEdge = function (area_coordinates) {

    var longestEdge = [];
    var largerDistance = 0;

    for (let i = 0; i < (area_coordinates.length - 1); i++) {

        let initialPoint = area_coordinates[i];
        let finalPoint = area_coordinates[i + 1];

        let distance = turf.distance(initialPoint, finalPoint);

        if (distance > largerDistance) {
            largerDistance = distance;
            longestEdge = [initialPoint, finalPoint];
        }
    }
    return longestEdge;
}


var farthestVertex = function (area_coordinates, longestEdge) {

    var maxDistance = 0;
    var farthestVertex = [];

    for (let i = 0; i < (area_coordinates.length - 1); i++) {

        // Calculando a distância entre a maior aresta e o vértice mais distante
        let distance = turf.pointToLineDistance(area_coordinates[i], [longestEdge[0], longestEdge[1]]);

        // Armazenando a distância e o vértice mais distante
        if (distance > maxDistance) {
            maxDistance = distance;
            farthestVertex = area_coordinates[i];
        }
    }

    //drawMultiPoint('vertex', 'Point', farthestVertex, '#f00');

    return farthestVertex;
}

// == SELECIONANDO O PONTO DE PARTIDA DA ROTA (VÉRTICE INICIAL) == //
function selectInitialPosition() {

    selectedPosition = draw.getSelectedPoints();
    //console.log(selectedPosition);

    // Ao clicar no mapa, deve-se selecionar as coordenadas do ponto desenhado no mapa
    if (turf.coordAll(selectedPosition).length !== 0) {

        // Atualizando a posição inicial (home location)
        homePosition = turf.coordAll(selectedPosition);
        home = homePosition[0];

        // Criando um polígono reduzido para gerar a rota mais distante das extremidades
        // A variável selectedPosition é atualizada para um dos vértices do polígono reduzido
        selectedPosition = drawReducedPolygon02(draw.getAll().features[0].geometry.coordinates[0],
            selectedPosition);

        createParallelLines(draw.getAll().features[0].geometry.coordinates[0],
            selectedPosition);
    }
}

// == REDUZINDO POLÍGONO PARA QUE A ROTA ESTEJA DENTRO DA ÁREA == //
function drawReducedPolygon02(areaPolygon, selectedPosition) {

    console.log(areaPolygon);

    // Acessando o parâmetro de "distância entre linhas" definido pelo usuário
    inputDistance = document.getElementById("distance").value;
    distanceBetweenLines = (inputDistance == '') ? 0.05 : inputDistance / 1000;

    // Recalculando a maior aresta usando o polígono original
    //longestEdgeLongLat = longestEdge(turf.coordAll(areaPolygon));
    longestEdgeLongLat = longestEdge(areaPolygon);

    // Gera-se uma linha pararela à linha de referência para verificar 
    // se a distância até o vértice mais distante aumenta ou diminui
    referenceLine = turf.lineString([longestEdgeLongLat[0], longestEdgeLongLat[1]]);

    referenceParalelLine = turf.lineOffset(referenceLine, distanceBetweenLines);
    pt = farthestVertexLongLat;

    distanceToFirstLine = turf.pointToLineDistance(pt, referenceParalelLine);

    // Medindo a distância entre o vértice mais distante e a linha de referência
    totalDistance = turf.pointToLineDistance(pt, longestEdgeLongLat);

    // Se a distância aumenta, então distanceBetweenLines deve ser negativo
    if (distanceToFirstLine > totalDistance) {
        distanceBetweenLines = -distanceBetweenLines;
    }

    // Array que conterá as novas coordenadas do polígono reduzido
    reducedPolygon = [];
    flag = false;

    // Percorrendo todos os vértices do polígono
    //for(i = 0; i < turf.coordAll(areaPolygon).length - 1; i++){
    for (i = 0; i < areaPolygon.length - 1; i++) {

        //var line = turf.lineString([turf.coordAll(areaPolygon)[i], turf.coordAll(areaPolygon)[i+1]]);
        var line = turf.lineString([areaPolygon[i], areaPolygon[i + 1]]);

        // Definindo o deslocamento das linhas paralelas para gerar o polígono interno
        var offsetLine = turf.lineOffset(line, distanceBetweenLines / 2);

        // Armazenando todas as linhas paralelas que irão formar o polígono interno
        reducedPolygon[i] = turf.coordAll(offsetLine);
    }

    //drawMultiLineString('reducedPolygon', reducedPolygon, '#888');

    newPolygon = [];

    // Calculando as intersecções entre as linhas internas paralelas
    // para gerar o polígono interno
    for (j = 0; j < reducedPolygon.length; j++) {

        if (j < reducedPolygon.length - 1) {
            var line1 = turf.lineString(reducedPolygon[j]);
            var line2 = turf.lineString(reducedPolygon[j + 1]);
        } else {
            var line1 = turf.lineString(reducedPolygon[j]);
            var line2 = turf.lineString(reducedPolygon[0]);
        }
        // Gerando o novo polígono interno com base nas interseções das linhas paralelas internas
        newPolygon[j] = turf.lineIntersect(line1, line2).features[0].geometry.coordinates;
    }

    polygon = [];
    // Ao gerar um novo polígono interno através da interseção das linhas, 
    // a posição dos vértices é deslocada e precisa ser corrigida
    for (j = 0; j < newPolygon.length; j++) {
        if (j == 0) {
            polygon[j] = newPolygon[newPolygon.length - 1];
        } else {
            polygon[j] = newPolygon[j - 1];
        }
    }

    // A última posição do vetor de coordenadas dos vértices do polígono 
    // deve ser igual a primeira posição
    polygon[j] = polygon[0];

    // Atualizando a posição (vértice) selecionada pelo usuário
    // Esta posição será um dos vértices do polígono reduzido
    for (j = 0; j < areaPolygon.length; j++) {

        if (areaPolygon[j][0] == turf.coordAll(selectedPosition)[0][0] &&
            areaPolygon[j][1] == turf.coordAll(selectedPosition)[0][1] && !flag) {


            selectedPosition = turf.point(polygon[j]);
            flag = true;
        }
    }

    // Atualizando a variável reducedPolygon com o novo polígono interno gerado
    // Esta variável será utilizada no restante da biblioteca
    reducedPolygon = polygon;
    return selectedPosition;
}

function longestEdge02(reducedPolygon) {

    var longestEdge = [];
    var initialPoint = [];
    var finalPoint = [];
    var largerDistance = 0;

    for (let i = 0; i < reducedPolygon.length - 1; i++) {

        initialPoint = [reducedPolygon[i][0], reducedPolygon[i][1]];
        finalPoint = [reducedPolygon[i + 1][0], reducedPolygon[i + 1][1]];

        let distance = turf.distance(initialPoint, finalPoint);

        if (distance > largerDistance) {
            largerDistance = distance;
            longestEdge[0] = initialPoint;
            longestEdge[1] = finalPoint;
        }
    }

    return longestEdge;
}

function createParallelLines(areaPolygon, selectedPosition) {

    // Acessando o parâmetro de "distância entre linhas" definido pelo usuário
    inputDistance = document.getElementById("distance").value;
    distanceBetweenLines = (inputDistance == '') ? 0.05 : inputDistance / 1000;

    // Recalculando a maior aresta usando o polígono original
    longestEdgeLongLat = longestEdge02(reducedPolygon);

    // Gera-se uma linha pararela à linha de referência para verificar 
    // se a distância até o vértice mais distante aumenta ou diminui
    referenceLine = turf.lineString([longestEdgeLongLat[0], longestEdgeLongLat[1]]);
    referenceParalelLine = turf.lineOffset(referenceLine, distanceBetweenLines);

    // Este é vertice mais distante em relação à maior aresta do polígono
    pt = farthestVertexLongLat;

    // Distância entre o vértice mais distante e a primeira linha de referência
    distance = turf.pointToLineDistance(pt, referenceParalelLine);

    // Medindo a distância entre o vértice mais distante da maior aresta
    totalDistance = turf.pointToLineDistance(pt, longestEdgeLongLat);

    // Mas o número de linhas é definido pela distância dividido pela distância entre linhas
    numberOfLines = Math.round(totalDistance / distanceBetweenLines);

    // Se a distância aumenta, então 'distanceBetweenLines' deve ser negativo
    if (distance > totalDistance) {
        distanceBetweenLines = -distanceBetweenLines;
    }

    line = turf.lineString([longestEdgeLongLat[0], longestEdgeLongLat[1]]);

    // Criando as linhas paralelas em relação à linha de referência
    paralelPath = [];
    for (i = 1; i < numberOfLines + 1; i++) {
        offsetLine = turf.lineOffset(line, distanceBetweenLines * i);

        // Apenas as coordenadas de cada linha são armazenadas no array
        paralelPath[i - 1] = turf.getCoords(offsetLine);
    }

    // Prolongando as linhas paralelas para gerar as interseções com o polígono
    extendedPoints = [];
    for (i = 0; i < paralelPath.length; i++) {

        // Novos pontos gerados a partir do deslocamento do vértice
        point = turf.point(paralelPath[i][0]);
        extendedDistance = 1.5;
        bearing = turf.bearing(longestEdgeLongLat[0], longestEdgeLongLat[1]);
        destination01 = turf.rhumbDestination(point, -extendedDistance, bearing);

        point = turf.point(paralelPath[i][1]);
        extendedDistance = 1.5;
        bearing = turf.bearing(longestEdgeLongLat[0], longestEdgeLongLat[1]);
        destination02 = turf.rhumbDestination(point, extendedDistance, bearing);

        extendedPoints[i] = [turf.getCoords(destination01), turf.getCoords(destination02)];
    }

    drawInternalPolygon(areaPolygon);
    drawNewIntersections(numberOfLines, extendedPoints, selectedPosition);
}

function drawInternalPolygon(areaPolygon) {
    // Array que conterá as novas coordenadas do polígono reduzido
    internalPolygon = [];

    // Percorrendo todos os vértices do polígono
    //for(i = 0; i < turf.coordAll(areaPolygon).length - 1; i++){
    for (i = 0; i < areaPolygon.length - 1; i++) {

        //var line = turf.lineString([turf.coordAll(areaPolygon)[i], turf.coordAll(areaPolygon)[i+1]]);
        var line = turf.lineString([areaPolygon[i], areaPolygon[i + 1]]);

        // Definindo o deslocamento das linhas paralelas para gerar o polígono interno
        var offsetLine = turf.lineOffset(line, distanceBetweenLines + (distanceBetweenLines / 2) - (distanceBetweenLines / 10));

        // Armazenando todas as linhas paralelas que irão formar o polígono interno
        internalPolygon[i] = turf.coordAll(offsetLine);
    }

    //drawMultiLineString('internalPoly', internalPolygon, '#999');

    // Calculando as intersecções entre as linhas internas paralelas
    // para gerar o polígono interno
    newInternalPolygon = [];
    for (j = 0; j < internalPolygon.length; j++) {

        if (j < internalPolygon.length - 1) {
            var line1 = turf.lineString(internalPolygon[j]);
            var line2 = turf.lineString(internalPolygon[j + 1]);
        } else {
            var line1 = turf.lineString(internalPolygon[j]);
            var line2 = turf.lineString(internalPolygon[0]);
        }
        // Gerando o novo polígono interno com base nas interseções das linhas paralelas internas
        newInternalPolygon[j] = turf.lineIntersect(line1, line2).features[0].geometry.coordinates;
    }

    internalPolygon = [];
    // Ao gerar um novo polígono interno através da interseção das linhas, 
    // a posição dos vértices é deslocada e precisa ser corrigida
    for (j = 0; j < newInternalPolygon.length; j++) {
        if (j == 0) {
            internalPolygon[j] = newInternalPolygon[newInternalPolygon.length - 1];
        } else {
            internalPolygon[j] = newInternalPolygon[j - 1];
        }
    }

    // A última posição do vetor de coordenadas dos vértices do polígono 
    // deve ser igual a primeira posição
    internalPolygon[j] = internalPolygon[0];
}

function drawNewIntersections(numberOfLines, extendedPoints, selectedPosition) {

    // Acessando o array de coordenadas do polígono reduzido
    edges = reducedPolygon;
    internalEdges = internalPolygon;
    index_en = 0;
    index_in = 0;

    // Identificando o índice da maior aresta
    for (i = 0; i < edges.length - 1; i++) {
        if (longestEdgeLongLat[0][0] == edges[i][0] && longestEdgeLongLat[0][1] == edges[i][1]) {
            index_en = i;
            index_in = i;
        }
    }

    // Reordenando os vértices do polígono para evitar problemas na ordem das intersecções
    orderedEdges = [];
    for (i = 0; i < edges.length; i++) {
        orderedEdges[i] = edges[index_en];
        index_en = (index_en == edges.length - 2) ? 0 : index_en + 1;
    }

    // Reordenando os vértices do polígono para evitar problemas na ordem das intersecções
    internalOrderedEdges = [];
    for (i = 0; i < internalEdges.length; i++) {
        internalOrderedEdges[i] = internalEdges[index_in];
        index_in = (index_in == internalEdges.length - 2) ? 0 : index_in + 1;
    }

    // Array que armazenará todas os pontos de intersecção 
    // entre as linhas paralelas (lines) e as arestas do polígono (orderedEdges)
    intersectionPoints = [];
    internalIntersections = [];
    index = 0;
    k = 0;

    // Acessando o array de coordenadas das linhas paralelas
    lines = turf.getCoords(extendedPoints);

    // Percorrendo todas as linhas paralelas
    for (i = 0; i < numberOfLines; i++) {
        // Acessando cada linha paralela individualmente
        line1 = turf.lineString(lines[i]);

        // Percorrendo todas as arestas do polígono
        for (j = 0; j < orderedEdges.length - 1; j++) {

            // Acessando cada aresta do polígono individualmente
            line2 = turf.lineString([orderedEdges[j], orderedEdges[j + 1]]);
            line3 = turf.lineString([internalOrderedEdges[j + 1], internalOrderedEdges[j]]);

            // Detectando a interseção entre as duas linhas
            intersects = turf.lineIntersect(line1, line2);

            // Se a intersecção ocorreu, ou seja, o array contém as coordenadas de um ponto
            if (intersects.features.length !== 0) {
                // O ponto de intersecção é armazenado no array de intersecções
                intersectionPoints[index] = turf.getCoords(intersects.features[0]);
                index++;
            }

            // Detectando a interseção entre as duas linhas
            intersects02 = turf.lineIntersect(line1, line3);

            // Se a intersecção ocorreu, ou seja, o array contém as coordenadas de um ponto
            if (intersects02.features.length !== 0) {
                // O ponto de intersecção é armazenado no array de intersecções
                internalIntersections[k] = turf.getCoords(intersects02.features[0]);
                k++;
            }
        }
    }

    // Começa a definição das fases de rotas
    defineRoutes02(selectedPosition);
}

function getInternalFarthestVertex(farthestVertexLongLat) {

    let distance = 0;
    let minorDistance = 0;
    let index = 0;

    for (i = 0; i < orderedEdges.length - 1; i++) {
        from = turf.point(orderedEdges[i]);
        to = turf.point(farthestVertexLongLat);

        distance = turf.distance(from, to);

        if (i == 0) minorDistance = distance;

        if (distance < minorDistance) {
            minorDistance = distance;
            index = i;
        }
    }

    fv = orderedEdges[index];
    return fv;
}

function defineRoutes02(selectedPosition) {

    // Posição inicial do voo selecionado pelo usuário clicando em um dos vértices
    initialPosition = turf.coordAll(selectedPosition);

    fv = getInternalFarthestVertex(farthestVertexLongLat);

    // Percorrendo o polígono reduzido para gerar a primeira parte da rota:
    // do ponto inicial até o ponto mais distante da maior aresta
    for (i = 0; i < orderedEdges.length - 1; i++) {

        if (orderedEdges[i][0] == initialPosition[0][0] && orderedEdges[i][1] == initialPosition[0][1]) {
            index_rp = i;
        }

        if (orderedEdges[i][0] == fv[0] && orderedEdges[i][1] == fv[1]) {
            index_fv = i;
        }

        if (orderedEdges[i][0] == longestEdgeLongLat[0][0] && orderedEdges[i][1] == longestEdgeLongLat[0][1]) {
            index_le_01 = i;
        }

        if (orderedEdges[i][0] == longestEdgeLongLat[1][0] && orderedEdges[i][1] == longestEdgeLongLat[1][1]) {
            index_le_02 = i;
        }
    }

    // FASE 03 DA ROTA
    phase03Path = [];
    finalPhase03Path = [];
    if (index_rp == index_fv) {
        finalPhase03Path = orderedEdges[index_fv];

    } else {
        phase03Distance = [0, 0];

        // Percorrendo nos dois sentidos
        for (i = 0; i < 2; i++) {
            index = index_fv;
            distance = 0;
            path = [];

            path.push(orderedEdges[index]);

            // Enquanto os vértices de busca forem diferentes da posição inicial...
            while (orderedEdges[index][0] != orderedEdges[index_rp][0] &&
                orderedEdges[index][1] != orderedEdges[index_rp][1]) {

                from = turf.point([orderedEdges[index][0], orderedEdges[index][1]]);

                if (i == 0) // Aumentando o index
                    index = (index != orderedEdges.length - 2) ? index + 1 : 0;
                else // Diminuindo o index
                    index = (index == 0) ? orderedEdges.length - 2 : index - 1;

                to = turf.point([orderedEdges[index][0], orderedEdges[index][1]]);

                path.push([orderedEdges[index][0], orderedEdges[index][1]]);

                distance = turf.distance(from, to);
                phase03Distance[i] += distance;
            }
            phase03Path[i] = path;
            path = [];
        }

        // Armazenando a rota com a menor distância
        finalPhase03Path = [];
        if (phase03Distance[0] < phase03Distance[1]) {
            finalPhase03Path = phase03Path[0];
        } else {
            finalPhase03Path = phase03Path[1];
        }
    }

    // FASE 01 DA ROTA
    phase01Path = [];
    finalPhase01Path = [];
    if (index_le_01 == index_rp) {
        finalPhase01Path.push(orderedEdges[index_rp]);
        finalPhase01Path.push(orderedEdges[index_le_02]);

    } else if (index_le_02 == index_rp) {
        finalPhase01Path.push(orderedEdges[index_rp]);
        finalPhase01Path.push(orderedEdges[index_le_01]);

    } else {
        phase01Distance = [0, 0];

        // Percorrendo nos dois sentidos
        for (i = 0; i < 2; i++) {
            index = index_rp;
            distance = 0;
            le_times = 0;
            path = [];

            path.push([orderedEdges[index][0], orderedEdges[index][1]]);

            while (le_times != 2) {
                from = turf.point([orderedEdges[index][0], orderedEdges[index][1]]);

                if (i == 0) // Aumentando o index
                    index = (index != orderedEdges.length - 2) ? index + 1 : 0;
                else // Diminuindo o index
                    index = (index == 0) ? orderedEdges.length - 2 : index - 1;

                to = turf.point([orderedEdges[index][0], orderedEdges[index][1]]);

                path.push([orderedEdges[index][0], orderedEdges[index][1]]);

                le_times = (index == index_le_01 || index == index_le_02) ? le_times + 1 : le_times;

                distance = turf.distance(from, to);
                phase01Distance[i] += distance;
            }
            phase01Path[i] = path;
            path = [];
        }
        // Armazenando a rota com a menor distância
        finalPhase01Path = [];
        if (phase01Distance[0] < phase01Distance[1]) {
            finalPhase01Path = phase01Path[0];
        } else {
            finalPhase01Path = phase01Path[1];
        }
    }

    // Imprimindo a fase 01 da rota
    //drawMultiLineStringArray('phase01', finalPhase01Path, '#fff');

    // Imprimindo a fase 03 da rota
    //drawMultiLineStringArray('phase03', finalPhase03Path, '#000');

    cont = 0;
    //console.log("pontos externos: " + intersectionPoints.length);
    //console.log("pontos internos: " + internalIntersections.length);

    difference = intersectionPoints.length - internalIntersections.length;

    // Percorrendo os pontos de intersecção externos
    // e verificando quais destes pontos cruzam com as arestas da fase 01 e 03.
    // Nestes casos, são utilizados os pontos de intersecção internos	
    for (i = 0; i < intersectionPoints.length - difference; i++) {
        pt = turf.point(intersectionPoints[i]);
        line01 = turf.lineString(finalPhase01Path);
        isPointOnLine01 = turf.pointToLineDistance(pt, line01);

        if (isPointOnLine01 < 0.01) {
            intersectionPoints[i] = internalIntersections[i];
        }
    }

    for (j = 0; j < intersectionPoints.length - difference; j++) {
        pt = turf.point(intersectionPoints[j]);
        line03 = turf.lineString(finalPhase03Path);
        isPointOnLine03 = turf.pointToLineDistance(pt, line03);

        if (isPointOnLine03 < 0.01) {
            intersectionPoints[j] = internalIntersections[j];
        }
    }

    // Removendo os elementos que sobraram da diferença
    // entre o polígono externo e interno	
    for (w = 0; w < difference; w++) {
        intersectionPoints.pop();
    }

    // Verificando de qual lado começa o movimento de vai-e-volta para definir o começo
    // das alternâncias
    index01 = finalPhase01Path.length - 1;
    distance01 = turf.distance(
        turf.point(intersectionPoints[0]),
        turf.point(finalPhase01Path[index01])
    );
    distance02 = turf.distance(
        turf.point(intersectionPoints[1]),
        turf.point(finalPhase01Path[index01])
    );

    if (distance01 < distance02) {
        startIndex = 2;
    } else {
        startIndex = 0;
    }

    // Criando as conexões entre os pontos de intersecção para gerar a rota de vai-e-volta
    for (i = startIndex; i < intersectionPoints.length; i += 4) {
        aux = intersectionPoints[i];
        intersectionPoints[i] = intersectionPoints[i + 1];
        intersectionPoints[i + 1] = aux;
    }

    // Unificando as 3 fases da rota
    // Se a rota da fase 03 conter apenas um ponto, é preciso forçar a criação de um array
    if (finalPhase03Path[0].length === undefined) {
        ultimatePath = finalPhase01Path.concat(intersectionPoints);
        ultimatePath = ultimatePath.concat([[finalPhase03Path[0], finalPhase03Path[1]]]);

    } else {
        ultimatePath = finalPhase01Path.concat(intersectionPoints, finalPhase03Path);
    }

    // Desenhando a rota final no mapa
    //drawMultiLineStringArray('ultimatePath', ultimatePath, '#0f0');

    // Calculando a distância total da rota
    routeTotalDistance(ultimatePath);
}

function drawMultiPoint(id, type, points, color) {

    cleanLayerById(id);

    map.addSource(id, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': type,
                'coordinates': points
            }
        }
    });

    map.addLayer({
        'id': id,
        'type': 'circle',
        'source': id,
        'paint': {
            'circle-color': color
        }
    });
}

function drawMultiLineString(id, points, color) {

    cleanLayerById(id);
    map.addSource(id, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'MultiLineString',
                'coordinates': points
            }
        }
    });

    map.addLayer({
        'id': id,
        'type': 'line',
        'source': id,
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': color,
            'line-width': 2
        }
    });
}

function drawLineString(id, points, color) {

    cleanLayerById(id);
    map.addSource(id, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': points
            }
        }
    });

    map.addLayer({
        'id': id,
        'type': 'line',
        'source': id,
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': color,
            'line-width': 2
        }
    });
}

function drawMultiLineStringArray(id, points, color) {

    cleanLayerById(id);
    map.addSource(id, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'MultiLineString',
                'coordinates': [points]
            }
        }
    });

    map.addLayer({
        'id': id,
        'type': 'line',
        'source': id,
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': color,
            'line-width': 2
        }
    });
}

// == MEDINDO A DISTÂNCIA TOTAL DA ROTA == //
function routeTotalDistance(ultimatePath) {

    // Se a opção de WP Grid estiver habilitada, 
    // são gerados waypoints intermediários em todos os trechos da rota	
    if (document.getElementById("wp-grid").checked) {
        // Gerando os waypoints intermediários
        ultimatePath = createIntermediateWaypoints(ultimatePath);
    } else {
        cleanLayerById('intermediatePoints');
    }

    // Distância percorrida na fase 01 da rota
    totalDistance = 0;
    partialDistance = 0;

    // Se a rota ultrapassar o limite de tempo de voo estiupulado,
    // ela deve ser quebrada em vários voos. Para isso, são armazenados
    // breakpoints em que a rota é interrompida e retorna para a base
    breakpoints = [];

    // Percorrendo a rota completa
    for (j = 0; j < ultimatePath.length - 1; j++) {

        partialDistance += turf.distance(turf.point([ultimatePath[j][0], ultimatePath[j][1]]),
            turf.point([ultimatePath[j + 1][0], ultimatePath[j + 1][1]]));

        totalDistance += turf.distance(turf.point([ultimatePath[j][0], ultimatePath[j][1]]),
            turf.point([ultimatePath[j + 1][0], ultimatePath[j + 1][1]]));

        // Verificando o tempo de voo baseado na distância parcial atual percorrida
        // para criar o breakpoints
        calculateFlightTime(partialDistance);
        console.log("Time: " + time);

        // Acessando o limite máximo de tempo definido pelo usuário
        maxFlightTime = Number.parseInt(document.getElementById('max-flight-time').value) * 60;

        // Se 'time' computado pela função calculateFlightTime exceder o limite máximo,
        // cria-se um breakpoint para retornar para a base		
        if (time >= maxFlightTime) {
            console.log("Quebra: " + j);
            partialDistance = 0;
            breakpoints.push([ultimatePath[j][0], ultimatePath[j][1]]);
        }
    }

    // Exibindo a distância total percorrida no box de informações
    var distanceBox = document.getElementById("calculated-distance");
    distanceBox.innerHTML = totalDistance.toFixed(2) + " Km";

    // Desenhando a rota final no mapa de forma interativa
    // É possível clicar nos waypoints e movimentá-los
    if (ultimatePath.length != 0) {
        if (idFinalPath != 0)
            draw.delete(idFinalPath);

        idFinalPath = draw.add(turf.polygon([ultimatePath]));
    }

    calculateFlightTime(totalDistance);
    drawMultiPoint('brkpnt', 'MultiPoint', breakpoints, '#f00');
}

function createIntermediateWaypoints(temp) {

    allIntermediateWp = [];
    index = 0;

    for (j = 0; j < temp.length - 1; j++) {

        lineDistance = turf.distance(temp[j], temp[j + 1]);
        line = turf.lineString([temp[j], temp[j + 1]]);

        distanceBetweenWp = (distanceBetweenLines < 0) ? -distanceBetweenLines : distanceBetweenLines;
        numberOfWp = Math.round(lineDistance / distanceBetweenWp);

        //intermediateWp = [];

        for (i = 0; i <= numberOfWp; i++) {
            //intermediateWp[i] = turf.getCoord(turf.along(line, distanceBetweenWp * i));
            allIntermediateWp[index] = turf.getCoord(turf.along(line, distanceBetweenWp * i));
            index++;
        }
    }

    // Igualando a primeira e a última posição
    allIntermediateWp.push(allIntermediateWp[0]);

    // Desenhando os novos pontos intermediários de rota
    //drawMultiPoint('intrmdt', 'MultiPoint', allIntermediateWp, '#0f0');

    return allIntermediateWp;
}

// ============================================================================================= PART 3: MENU  ============================================================================================= //

// NEW 
const btnNew = document.getElementById("btn-new");
btnNew.addEventListener("click", clearMap);

// SAVE
const btnSaveMenu = document.getElementById("btn-save");
btnSaveMenu.addEventListener("click", savePath);

// FILE IMPORT ==============================================
const btnImportBar = document.getElementById("btn-import");
btnImportBar.addEventListener("click", () => {
    document.getElementById("saving-bar").classList.add("hidden");
    document.getElementById("config-bar").classList.add("hidden");
    document.getElementById("help-modal").classList.add("hidden");
    document.getElementById("import-file-bar").classList.toggle("hidden");
});

// IMPORT TXT FILE
const btnImportTxt = document.getElementById("file-import-txt");
btnImportTxt.addEventListener('change', importTxtFile, false);

// IMPORT KML FILE
const btnImportKml = document.getElementById("file-import-kml");
btnImportKml.addEventListener('change', importKMLPoint, false);

// IMPORT POLY KML FILE
const btnImportPoly = document.getElementById("file-import-poly");
btnImportPoly.addEventListener('change', importKMLPolygon, false);

// IMPORT KML PATH FILE
const btnImportPath = document.getElementById("file-import-path");
btnImportPath.addEventListener('change', importKMLPath, false);

// IMPORT KML POLY FILE
const btnImportMP = document.getElementById("file-import-mp");
btnImportMP.addEventListener('change', importMPPolygon, false);

// ===============================================================

// HELP MODAL ===============================================
const btnHelp = document.getElementById("btn-help");
btnHelp.addEventListener("click", function () {
    document.getElementById("saving-bar").classList.add("hidden");
    document.getElementById("config-bar").classList.add("hidden");
    document.getElementById("import-file-bar").classList.add("hidden");
    document.getElementById("help-modal").classList.toggle("hidden");

    document.getElementById("modal-close-button").addEventListener("click", () => {
        document.getElementById("help-modal").classList.add("hidden");
    });
});
// ===============================================================

// BTN OPEN CONFIGURATION MODAL ===============================================
const btnConfiguration = document.getElementById("btn-configuration");
btnConfiguration.addEventListener('click', function () {
    document.getElementById("saving-bar").classList.add("hidden");
    document.getElementById("import-file-bar").classList.add("hidden");
    document.getElementById("help-modal").classList.add("hidden");
    document.getElementById("config-bar").classList.toggle("hidden");
});
// ===============================================================

// BTN EXIT ===============================================
const btnExit = document.getElementById("btn-exit");
btnExit.addEventListener("click", function () {
    window.close();
});
// ===============================================================

// CONFIGURATIONS ===============================================
var configDistance = document.getElementById("distance");
var labelDistance = document.getElementById("label-distance");
var wpGrid = document.getElementById('wp-grid');

wpGrid.onchange = function () {
    cleanLayers();
    selectInitialPosition();
}

configDistance.onchange = function () {
    selectInitialPosition();
    labelDistance.innerHTML = "Distância: " + configDistance.value + "m";
}

// Velocidade
var configSpeed = document.getElementById("speed");
var labelSpeed = document.getElementById("label-speed");

configSpeed.onchange = function () {
    if (typeof totalDistance !== 'undefined') calculateFlightTime(totalDistance);
    labelSpeed.innerHTML = "Velocidade: " + configSpeed.value + "m/s";
}

// Altitude
var configAltitude = document.getElementById("altitude");
var labelAltitude = document.getElementById("label-altitude");

configAltitude.onchange = function () {
    labelAltitude.innerHTML = "Altitude: " + configAltitude.value + "m";
}

// Tempo de voo
var configTempo = document.getElementById("max-flight-time");
var labelTempo = document.getElementById("label-max-flight-time");

configTempo.onchange = function () {
    selectInitialPosition();
    labelTempo.innerHTML = "Tempo: " + configTempo.value + "min";
}

// ===============================================================

// Acessando o botão do marcador
var btnMarker = document.getElementById('marker');

btnMarker.onclick = function () {

    if (marcador.display) {
        marcador.remove();
        marcador.display = false;
    } else {
        marcador = new mapboxgl.Marker({ color: 'black' })
            .setLngLat(home)
            .addTo(map);
        marcador.display = true;
    }
}

// ============================================================================================= PART 4: IMPORT ROUTINES  ============================================================================================= //

// Get from server storage
window.onload = async function () {

    // get url
    const url = window.location.href;

    // get parameters
    const flight_plan_id = url.split("/")[5];

    if (typeof flight_plan_id !== 'undefined') {

        // get flight plan
        const response = await axios.get(`/api/v1/actions/flight-plans/${flight_plan_id}/map`);

        // Limpando layers, campos e polígono
        cleanLayers();
        cleanPolygon();

        // Conteúdo completo do arquivo
        var contents = response.data.contents;

        // Quebrando as linhas do arquivo em um array
        var lines = contents.split("\n");

        // Acessando a posição inicial (home) contida no arquivo
        var txtHome = lines[1].split("\t");
        home = [Number(txtHome[9]), Number(txtHome[8])];

        // Acessando a velocidade contida no arquivo e preenchendo o campo no form
        var txtSpeed = lines[3].split("\t");
        document.getElementById("speed").value = Number(txtSpeed[4]).toFixed(0);
        document.getElementById("label-speed").innerHTML = "Velocidade: " + Number(txtSpeed[4]).toFixed(0) + "m/s";

        // Acessando a altitude contida no arquivo e preenchendo o campo no form
        var txtAltitude = lines[2].split("\t");
        document.getElementById("altitude").value = Number(txtAltitude[10]).toFixed(0);
        document.getElementById("label-altitude").innerHTML = "Altitude: " + Number(txtAltitude[10]).toFixed(0) + "m";

        // Array que armazenará todos os waypoints da rota do arquivo
        txtPath = [];
        index = 0;

        // Quebrando todas as linhas nos espaços \t
        for (i = 4; i < lines.length - 2; i++) {
            line = lines[i].split("\t");

            // Somente os waypoints com latitude e longitude são considerados, ou seja, código 16
            // Os waypoints de código 183 (gatilho do dispenser) tem lat/long zerados e não podem ser
            // adicionados ao desenho da rota
            if (Number(line[3]) == 16) {
                // As posições de latitude e longitude estão nos índices 9 e 8 de cada linha
                txtPath[index] = [Number(line[9]), Number(line[8])];
                index++
            }
        }

        // Array que armazenará todas as coordenadas do polígono extraídas a partir do arquivo
        txtArea = [];
        index = 0;

        // Quebrando a última linha para acessar as coordenadas do polígono
        txtPolygon = lines[lines.length - 1].split("\t");

        // Acessando todas as coordenadas
        for (i = 1; i < txtPolygon.length - 1; i++) {
            txtLatLong = txtPolygon[i].split(",");
            txtArea[index] = [Number(txtLatLong[0]), Number(txtLatLong[1])];
            index++;
        }

        // Acessando o centroide da área para posicionar no mapa
        var polygon = turf.polygon([txtArea]);
        var centroid = turf.coordAll(turf.centroid(polygon));

        // Direcionando o mapa
        map.flyTo({
            center: [
                centroid[0][0], centroid[0][1]
            ],
            essential: true
        });

        // Desenhando a rota e calculando sua distância
        drawTxtPath(txtPath);
        calculateTxtDistance(txtPath);

        // Desenhando o polígono e calculando sua área
        drawTxtArea(txtArea);
        calculateTxtArea();

    }
}

function importTxtFile(e) {

    // Limpando layers, campos e polígono
    cleanLayers();
    cleanPolygon();

    var file = e.target.files[0];
    var extension = e.target.files[0].name.split('.').pop().toLowerCase();
    if (!file || extension !== 'txt') { return; }

    var reader = new FileReader();

    reader.onload = function (e) {
        // Conteúdo completo do arquivo
        var contents = e.target.result;

        // Quebrando as linhas do arquivo em um array
        var lines = contents.split("\n");

        // Acessando a posição inicial (home) contida no arquivo
        var txtHome = lines[1].split("\t");
        home = [Number(txtHome[9]), Number(txtHome[8])];

        // Acessando a velocidade contida no arquivo e preenchendo o campo no form
        var txtSpeed = lines[3].split("\t");
        document.getElementById("speed").value = Number(txtSpeed[4]).toFixed(0);
        document.getElementById("label-speed").innerHTML = "Velocidade: " + Number(txtSpeed[4]).toFixed(0) + "m/s";

        // Acessando a altitude contida no arquivo e preenchendo o campo no form
        var txtAltitude = lines[2].split("\t");
        document.getElementById("altitude").value = Number(txtAltitude[10]).toFixed(0);
        document.getElementById("label-altitude").innerHTML = "Altitude: " + Number(txtAltitude[10]).toFixed(0) + "m";

        // Array que armazenará todos os waypoints da rota do arquivo
        txtPath = [];
        index = 0;

        // Quebrando todas as linhas nos espaços \t
        for (i = 4; i < lines.length - 2; i++) {
            line = lines[i].split("\t");

            // Somente os waypoints com latitude e longitude são considerados, ou seja, código 16
            // Os waypoints de código 183 (gatilho do dispenser) tem lat/long zerados e não podem ser
            // adicionados ao desenho da rota
            if (Number(line[3]) == 16) {
                // As posições de latitude e longitude estão nos índices 9 e 8 de cada linha
                txtPath[index] = [Number(line[9]), Number(line[8])];
                index++
            }
            console.log(Number(line[3]));

        }

        // Array que armazenará todas as coordenadas do polígono extraídas a partir do arquivo
        txtArea = [];
        index = 0;

        // Quebrando a última linha para acessar as coordenadas do polígono
        txtPolygon = lines[lines.length - 1].split("\t");

        // Acessando todas as coordenadas
        for (i = 1; i < txtPolygon.length - 1; i++) {
            txtLatLong = txtPolygon[i].split(",");
            txtArea[index] = [Number(txtLatLong[0]), Number(txtLatLong[1])];
            index++;
        }

        // Acessando o centroide da área para posicionar no mapa
        var polygon = turf.polygon([txtArea]);
        var centroid = turf.coordAll(turf.centroid(polygon));

        // Direcionando o mapa
        map.flyTo({
            center: [
                centroid[0][0], centroid[0][1]
            ],
            essential: true
        });

        // Desenhando a rota e calculando sua distância
        drawTxtPath(txtPath);
        calculateTxtDistance(txtPath);

        // Desenhando o polígono e calculando sua área
        drawTxtArea(txtArea);
        calculateTxtArea();

    };
    reader.readAsText(file);
}

function importKMLPoint(e) {

    // Limpando layers, campos e polígono
    cleanLayers();
    cleanPolygon();

    // Apagando o marcador anterior
    marcador.remove();

    var file = e.target.files[0];
    var extension = e.target.files[0].name.split('.').pop().toLowerCase();
    if (!file || extension !== 'kml') { return; }

    var reader = new FileReader();

    reader.onload = function (e) {
        // Conteúdo completo do arquivo
        var contents = e.target.result;

        // Localizando as tags <coordinates> dentro do arquivo
        var coordinates = contents.substring(
            contents.search("<coordinates>") + 13,
            contents.search("</coordinates>")
        );

        // Quebrando a única coordenada do ponto
        coordinates = coordinates.split(",");
        home = [Number(coordinates[0]), Number(coordinates[1])];

        // Direcionando o mapa para a posição inicial
        map.flyTo({
            center: [
                home[0],
                home[1]
            ],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });

        // Adicionando um marcador no ponto KML importados
        marcador = new mapboxgl.Marker({ color: 'black' })
            .setLngLat(home)
            .addTo(map);

    };
    reader.readAsText(file);
}

function importKMLPolygon(e) {

    // Limpando layers, campos e polígono
    cleanLayers();
    cleanPolygon();

    var file = e.target.files[0];
    var extension = e.target.files[0].name.split('.').pop().toLowerCase();
    if (!file || extension !== 'kml') { return; }

    var reader = new FileReader();

    reader.onload = function (e) {
        // Conteúdo completo do arquivo
        var contents = e.target.result;

        // Localizando as tags <coordinates> dentro do arquivo
        var coordinates = contents.substring(
            contents.search("<coordinates>") + 13,
            contents.search("</coordinates>")
        );

        // Quebrando todas as coordenadas do polígono
        coordinates = coordinates.split(" ");

        // Array que irá armazenar as coordenadas da área
        kmlArea = [];

        // Percorrendo todas as coordenadas e quebrando as informações de lat e long
        for (i = 0; i < coordinates.length - 1; i++) {
            console.log(coordinates[i]);

            latLong = coordinates[i].split(",");
            kmlArea[i] = [Number(latLong[0]), Number(latLong[1])];
        }

        // Certificando-se de que a primeira e a última posição de kmlArea são idênticas
        if (kmlArea[0][0] == kmlArea[kmlArea.length - 1][0] && kmlArea[0][1] == kmlArea[kmlArea.length - 1][1]) {
            console.log("São IGUAIS!");
        } else {
            console.log("NÃO SÃO IGUAIS!");
            kmlArea[i] = kmlArea[0];
        }

        console.log(kmlArea[0]);
        console.log(kmlArea[kmlArea.length - 1]);

        home = kmlArea[0];

        // Acessando o centroide da área para posicionar no mapa
        var polygon = turf.polygon([kmlArea]);
        var centroid = turf.coordAll(turf.centroid(polygon));

        // Direcionando o mapa
        map.flyTo({
            center: [
                centroid[0][0], centroid[0][1]
            ],
            essential: true
        });

        // Desenhando o polígono no mapa e calculando o tamanho da área importada
        drawTxtArea(kmlArea);
        calculateTxtArea();

        // Chamando novamente as funções que calculam a maior aresta e o vértice mais distante
        longestEdgeLongLat = longestEdge(kmlArea);
        farthestVertexLongLat = farthestVertex(kmlArea, longestEdgeLongLat);
    };
    reader.readAsText(file);
}

function importKMLPath(e) {

    // Limpando layers, campos e polígono
    cleanLayers();
    cleanPolygon();

    var file = e.target.files[0];
    var extension = e.target.files[0].name.split('.').pop().toLowerCase();
    if (!file || extension !== 'kml') { return; }

    var reader = new FileReader();

    reader.onload = function (e) {
        // Conteúdo completo do arquivo
        var contents = e.target.result;

        // Localizando as tags <coordinates> dentro do arquivo
        var coordinates = contents.substring(
            contents.search("<coordinates>") + 13,
            contents.search("</coordinates>")
        );

        // Quebrando todas as coordenadas do polígono
        coordinates = coordinates.split("\n");

        // Array que irá armazenar as coordenadas da área
        kmlArea = [];

        // Percorrendo todas as coordenadas e quebrando as informações de lat e long
        for (i = 0; i < coordinates.length - 1; i++) {
            console.log(coordinates[i]);

            latLong = coordinates[i].split(",");
            kmlArea[i] = [Number(latLong[0]), Number(latLong[1])];
        }

        // Certificando-se de que a primeira e a última posição de kmlArea são idênticas
        if (kmlArea[0][0] == kmlArea[kmlArea.length - 1][0] && kmlArea[0][1] == kmlArea[kmlArea.length - 1][1]) {
            console.log("São IGUAIS!");
        } else {
            console.log("NÃO SÃO IGUAIS!");
            kmlArea[i] = kmlArea[0];
        }

        console.log(kmlArea[0]);
        console.log(kmlArea[kmlArea.length - 1]);

        home = kmlArea[0];

        // Acessando o centroide da área para posicionar no mapa
        var polygon = turf.polygon([kmlArea]);
        var centroid = turf.coordAll(turf.centroid(polygon));

        // Direcionando o mapa
        map.flyTo({
            center: [
                centroid[0][0], centroid[0][1]
            ],
            essential: true
        });

        // Desenhando o polígono no mapa e calculando o tamanho da área importada
        drawTxtArea(kmlArea);
        calculateTxtArea();

        // Chamando novamente as funções que calculam a maior aresta e o vértice mais distante
        longestEdgeLongLat = longestEdge(kmlArea);
        farthestVertexLongLat = farthestVertex(kmlArea, longestEdgeLongLat);

        // Desenhando a rota e calculando sua distância
        drawTxtPath(kmlArea);
        calculateTxtDistance(kmlArea);
    };
    reader.readAsText(file);
}

function importMPPolygon(e) {

    // Limpando layers, campos e polígono
    cleanLayers();
    cleanPolygon();

    var file = e.target.files[0];
    var extension = e.target.files[0].name.split('.').pop().toLowerCase();
    if (!file || extension !== 'poly') { return; }

    var reader = new FileReader();

    reader.onload = function (e) {
        // Conteúdo completo do arquivo
        var contents = e.target.result;

        // Quebrando todas as coordenadas do polígono
        coordinates = contents.split(/\r?\n/);

        // Array que irá armazenar as coordenadas da área
        kmlArea = [];

        // Percorrendo todas as coordenadas e quebrando as informações de lat e long
        for (i = 0; i < coordinates.length - 1; i++) {

            latLong = coordinates[i].split(" ");
            kmlArea[i] = [Number(latLong[1]), Number(latLong[0])];
        }

        coordinatesLongLat = kmlArea;
        home = kmlArea[0];

        console.log(coordinatesLongLat);

        // Acessando o centroide da área para posicionar no mapa
        var polygon = turf.polygon([kmlArea]);
        var centroid = turf.coordAll(turf.centroid(polygon));

        // Direcionando o mapa
        map.flyTo({
            center: [
                centroid[0][0], centroid[0][1]
            ],
            essential: true
        });

        // Desenhando o polígono no mapa e calculando o tamanho da área importada
        drawTxtArea(kmlArea);
        calculateTxtArea();

        // Chamando novamente as funções que calculam a maior aresta e o vértice mais distante
        longestEdgeLongLat = longestEdge(kmlArea);
        farthestVertexLongLat = farthestVertex(kmlArea, longestEdgeLongLat);
    };
    reader.readAsText(file);
}

// CALCULANDO A DISTÂNCIA TOTAL DA ROTA IMPORTADA A PARTIR DO ARQUIVO 
function calculateTxtDistance(txtPath) {

    // Distância percorrida pela rota importada do arquivo
    totalDistance = 0;

    for (j = 0; j < txtPath.length - 1; j++) {
        totalDistance += turf.distance(turf.point([txtPath[j][0], txtPath[j][1]]), turf.point([txtPath[j + 1][0], txtPath[j + 1][1]]));
    }

    var distanceBox = document.getElementById("calculated-distance");
    distanceBox.innerHTML = totalDistance.toFixed(2) + " Km";

    calculateFlightTime(totalDistance);
}

// CALCULANDO O TEMPO DE VOO E A VELOCIDADE DA ROTA 
function calculateFlightTime(distance) {

    // Se a velocidade não for definida na configuração, ela é limitada a 8m/s 
    var avgSpeed = (speed.value == "") ? 8 : speed.value;

    // Tempo de execução da rota
    time = 0;
    time += Number((distance * 1000) / avgSpeed);
    var minutes = time / 60;
    var seconds = time % 60;

    var timeBox = document.getElementById("calculated-time");
    var roundedSec = (Math.round(seconds) < 10) ? "0" + Math.round(seconds) : Math.round(seconds);
    timeBox.innerHTML = Math.floor(minutes) + "m" + roundedSec + "s";
}

// CALCULANDO A ÁREA DO POLÍGONO IMPORTADA A PARTIR DO ARQUIVO 
function calculateTxtArea() {
    var data = draw.getAll();
    var answer = document.getElementById('calculated-area');
    var area = turf.area(data);

    var rounded_area = (Math.round(area * 100) / 100) / 10000;
    answer.innerHTML = rounded_area.toFixed(2) + ' ha';
}

// DESENHANDO O POLÍGONO DA ÁREA 
function drawTxtArea(txtArea) {

    var objArea = {
        'type': 'Polygon',
        'coordinates': [
            txtArea
        ]
    }
    draw.add(objArea);
}

// DESENHANDO A ROTA IMPORTADA A PARTIR DO ARQUIVO 
function drawTxtPath(txtPath) {

    // Limpando todos os layers
    cleanLayers();

    // Novos sources e layers são adicionados apenas se ainda não existem no mapa
    var objBF = {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'MultiLineString',
                'coordinates': [
                    txtPath
                ]
            }
        }
    }

    map.addSource('txtPath', objBF);

    map.addLayer({
        'id': 'txtPath',
        'type': 'line',
        'source': 'txtPath',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#fcba03',
            'line-width': 3
        }
    });
}

// ============================================================================================= PART 5: SAVE ROUTINES  ============================================================================================= //

function savePath() {

    if (initialPosition.length === 0) {
        showAlert("error", 'Nenhuma rota foi definida');
        return;
    }

    document.getElementById("config-bar").classList.add("hidden");
    document.getElementById("import-file-bar").classList.add("hidden");
    document.getElementById("help-modal").classList.add("hidden");

    // For filenames
    openSavingBar();
}

function generatePathSingleFile() {

    // Pegando a rota final a partir dos pontos desenhados no mapa
    // Estes pontos podem ter sido ajustados manualmente pelo usuário
    ultimatePath = draw.getAll().features[1].geometry.coordinates[0];

    // Definição da altitude de voo a partir da entrada do usuário no modal
    // Se a altitude não for preenchida, define-se um valor padrão
    inputAltitude = document.getElementById("altitude").value;
    var altitude = (inputAltitude == '') ? 10 : inputAltitude;

    // Definição da velocidade de voo a partir da entrada do usuário no modal
    // Se a velocidade não for preenchida, define-se um valor padrão
    inputSpeed = document.getElementById("speed").value;
    var speed = (inputSpeed == '') ? 8 : inputSpeed;

    // ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
    var content = "QGC WPL 110\n";

    // HOME
    content += "0\t1\t0\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
        home[1].toFixed(6) + "\t" +
        home[0].toFixed(6) + "\t" +
        altitude + ".000000" + "\t1\n";

    // TAKEOFF: 22
    content += "1\t0\t0\t22\t0.000000\t0.000000\t0.000000\t0.000000\t" +
        home[1].toFixed(6) + "\t" +
        home[0].toFixed(6) + "\t" +
        altitude + ".000000" + "\t1\n";

    // Corrigindo a altitude relativa: 16
    content += "2\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
        home[1].toFixed(6) + "\t" +
        home[0].toFixed(6) + "\t" +
        altitude + ".000000" + "\t1\n";

    // CHANGE SPEED: 178
    content += "3\t0\t3\t178\t" +
        speed + ".000000" + "\t" +
        speed + ".000000" +
        "\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";

    // WAYPOINT: 16
    for (j = 0; j < ultimatePath.length; j++) {
        content += (j + 4) +
            "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
            ultimatePath[j][1].toFixed(6) + "\t" +
            ultimatePath[j][0].toFixed(6) + "\t" +
            altitude + ".000000" + "\t1\n";

        if (document.getElementById('wp-grid').checked) {
            // Comando MAV_CMD_DO_SET_SERVO
            content += (j + 5) +
                "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
        }
    }

    // RETURN-T0-LAUNCH: 20
    content += (j + 4) + "\t0\t3\t20\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1";

    // Armazenando as coordenadas da área na última linha do arquivo através de um comentário
    content += "\n<!--\t";
    for (i = 0; i < coordinatesLongLat.length; i++) {
        content += coordinatesLongLat[i] + "\t";
    }
    content += "-->";

    var blob = new Blob([content],
        { type: "text/plain;charset=utf-8" });

    // Nome do arquivo com data em milissegundos decorridos
    const pathTimestamp = new Date().getTime();
    fileName = pathTimestamp + ".txt";

    const singlePathData = {
        blob: blob,
        filename: fileName,
        coordinates: coordinatesLongLat[0],
        timestamp: pathTimestamp
    };

    return singlePathData;

}

function generatePathMultiFile(singlePathData) {

    const multiPathData = [];

    // Pegando a rota final a partir dos pontos desenhados no mapa
    // Estes pontos podem ter sido ajustados manualmente pelo usuário
    ultimatePath = draw.getAll().features[1].geometry.coordinates[0];

    // Definição da altitude de voo a partir da entrada do usuário no modal
    // Se a altitude não for preenchida, define-se um valor padrão
    inputAltitude = document.getElementById("altitude").value;
    var altitude = (inputAltitude == '') ? 10 : inputAltitude;

    // Definição da velocidade de voo a partir da entrada do usuário no modal
    // Se a velocidade não for preenchida, define-se um valor padrão
    inputSpeed = document.getElementById("speed").value;
    var speed = (inputSpeed == '') ? 8 : inputSpeed;

    // Índice atual do 'ultimatePath'
    index = 0;

    // Geram-se várias rotas a partir dos breakpoints
    for (k = 0; k <= breakpoints.length; k++) {

        // ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
        var content = "QGC WPL 110\n";

        // HOME
        content += "0\t1\t0\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
            home[1].toFixed(6) + "\t" +
            home[0].toFixed(6) + "\t" +
            altitude + ".000000" + "\t1\n";

        // TAKEOFF: 22
        content += "1\t0\t0\t22\t0.000000\t0.000000\t0.000000\t0.000000\t" +
            home[1].toFixed(6) + "\t" +
            home[0].toFixed(6) + "\t" +
            altitude + ".000000" + "\t1\n";

        // Corrigindo a altitude relativa: 16
        content += "2\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
            home[1].toFixed(6) + "\t" +
            home[0].toFixed(6) + "\t" +
            altitude + ".000000" + "\t1\n";

        // CHANGE SPEED: 178
        content += "3\t0\t3\t178\t" +
            speed + ".000000" + "\t" +
            speed + ".000000" +
            "\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";

        // Identificação do waypoint
        var id = 4;

        // WAYPOINT: 16

        // Adicionando o breakpoint como primeiro ponto das subrotas intermediárias (k != 0). 
        // O VANT deve retornar para o mesmo ponto em que interrompeu a rota, ou seja,
        // o último ponto de uma subrota deve ser igual ao primeiro ponto da próxima 
        if (k != 0) {

            content += id +
                "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
                ultimatePath[index][1].toFixed(6) + "\t" +
                ultimatePath[index][0].toFixed(6) + "\t" +
                altitude + ".000000" + "\t1\n";

            id++;

            if (document.getElementById('wp-grid').checked) {
                // Comando MAV_CMD_DO_SET_SERVO
                content += id +
                    "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
                id++;
            }
            index++;
        }

        // Todas as subrotas, com exceção da última (k != breakpoints.length), 
        // são geradas até o breakpoint
        if (k != breakpoints.length) {

            while (ultimatePath[index][1] != breakpoints[k][1] &&
                ultimatePath[index][0] != breakpoints[k][0]) {

                content += id +
                    "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
                    ultimatePath[index][1].toFixed(6) + "\t" +
                    ultimatePath[index][0].toFixed(6) + "\t" +
                    altitude + ".000000" + "\t1\n";
                id++;

                if (document.getElementById('wp-grid').checked) {
                    // Comando MAV_CMD_DO_SET_SERVO
                    content += id +
                        "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
                    id++;
                }
                index++;
            }

            // Adicionando o breakpoint como últitmo ponto da subrota
            content += id +
                "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
                ultimatePath[index][1].toFixed(6) + "\t" +
                ultimatePath[index][0].toFixed(6) + "\t" +
                altitude + ".000000" + "\t1\n";
            id++;

            if (document.getElementById('wp-grid').checked) {
                // Comando MAV_CMD_DO_SET_SERVO
                content += id +
                    "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
                id++;
            }

            // A última subrota não possui breakpoint para interromper a geração de rota
            // Então, ela é gerada até o final do array 'ultimatePath'	
        } else {
            for (j = index; j < ultimatePath.length; j++) {
                content += id +
                    "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" +
                    ultimatePath[j][1].toFixed(6) + "\t" +
                    ultimatePath[j][0].toFixed(6) + "\t" +
                    altitude + ".000000" + "\t1\n";
                id++;

                if (document.getElementById('wp-grid').checked) {
                    // Comando MAV_CMD_DO_SET_SERVO
                    content += id +
                        "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
                    id++;
                }
            }
        }

        // RETURN-T0-LAUNCH: 20
        content += id +
            "\t0\t3\t20\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1";

        // Armazenando as coordenadas da área na última linha do arquivo através de um comentário
        content += "\n<!--\t";
        for (i = 0; i < coordinatesLongLat.length; i++) {
            content += coordinatesLongLat[i] + "\t";
        }
        content += "-->";

        var blob = new Blob([content],
            { type: "text/plain;charset=utf-8" });

        // Nome do arquivo é o contador do loop concatenado com o timestamp gerado no processo savePathAsSingleFile
        fileName = "0" + k + "_" + singlePathData.filename;

        multiPathData.push({
            blob: blob,
            filename: fileName,
            coordinates: coordinatesLongLat[0]
        });

    }

    return multiPathData;
}

function openSavingBar() {

    document.getElementById("sidebar").classList.add("hidden");

    html2canvas(document.body).then(canvas => {

        const canvasDataURL = canvas.toDataURL('image/jpeg', 1.0);

        return { canvasDataURL };

    }).then(({ canvasDataURL }) => {

        // Cropper modal
        document.getElementById("saving-bar").classList.remove("hidden");
        document.getElementById("sidebar").classList.remove("hidden");

        const image = document.getElementById('cropper-image');
        image.src = '';
        image.src = canvasDataURL;

        cropper = new Cropper(image, {
            aspectRatio: 0,
            viewMode: 1
        });

        // set inputs
        document.getElementById("name-confirmation").value = '';
        document.getElementById("speed-confirmation").value = document.getElementById("speed").value;
        document.getElementById("distance-confirmation").value = document.getElementById("distance").value;
        document.getElementById("altitude-confirmation").value = document.getElementById("altitude").value;
        document.getElementById("time-confirmation").value = document.getElementById("max-flight-time").value;

    });
}

// -- HOW CONNECT THESE TWO FUNCTIONS?

function saveFlightPlan() {

    // Verify if name was filled
    const flight_plan_name = document.getElementById("name-confirmation").value;
    if (flight_plan_name === "") {
        showAlert("error", "Informe o nome do plano de voo.");
        return;
    }

    // Generate route files
    const singlePathData = generatePathSingleFile();
    const multiPathData = generatePathMultiFile(singlePathData);

    // Generate cropper image
    const cropped_image_data_url = cropper.getCroppedCanvas().toDataURL('image/jpeg', 1.0);
    const filenameImg = new Date().getTime() + ".jpeg";

    saveToServer({
        flight_plan_name,
        singlePathData,
        multiPathData,
        image: {
            cropped_image_data_url,
            filenameImg
        }
    });

    /*saveLocally({
        flight_plan_name,
        singlePathData,
        multiPathData,
        image: {
            cropped_image_data_url,
            filenameImg
        }
    });*/

}


function saveToServer({ flight_plan_name, singlePathData, multiPathData, image: { cropped_image_data_url, filenameImg } }) {
    
    const btnSave = document.getElementById("btn-confirm-saving");
    btnSave.disabled = true;
    btnSave.innerText = "Salvando...";

    // const image = new Image(canvas.width, canvas.heigth);
    let formData = new FormData();

    formData.append("name", flight_plan_name);
    formData.append("single_file", new File([singlePathData.blob], singlePathData.filename, { type: "text/plain" }));

    multiPathData.map((fileData) => {
        formData.append("route_files[]", new File([fileData.blob], fileData.filename, { type: "text/plain" }));
        formData.append("coordinates[]", fileData.coordinates[1] + "," + fileData.coordinates[0]);
    });

    formData.append("imageDataURL", cropped_image_data_url);
    formData.append("imageFilename", filenameImg);
    formData.append("timestamp", singlePathData.timestamp);

    // Creating the request to the server

    let fetch_url = window.location.origin;

    // if exists, it's a modification
    const flight_plan_id = window.location.href.split("/")[5];

    if (typeof flight_plan_id !== "undefined") {
        formData.append('_method', 'PATCH');
        fetch_url += "/api/v1/actions/flight-plans/" + flight_plan_id + "/map";
    } else {
        fetch_url += "/api/v1/modules/flight-plans";
    }

    axios.post(fetch_url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        responseType: 'json'
    }).then((response) => {

        showAlert("success", "Salvo com sucesso!");
        clearMap();

        // Destroy the current cropper instance
        cropper.destroy();

        setTimeout(() => {
            document.getElementById('saving-bar').classList.add("hidden");
        }, 2000);

    }).catch((error) => {
        console.log(error);
        showAlert("error", error.response.status === 422 ? "Esse nome já está sendo utilizado." : "Erro ao salvar o plano de voo.");
        btnSave.disabled = false;
    })
        .finally(() => {
            btnSave.disabled = false;
            btnSave.innerText = "Salvar";
        });
}

function saveLocally({ flight_plan_name, singlePathData, multiPathData, image: { cropped_image_data_url, filenameImg } }) {

    const zip = new JSZip();

    // Adicionar arquivo único
    zip.folder("unique_file").file(singlePathData.filename, singlePathData.blob, { type: "text/plain" });

    // Adicionar múltiplos arquivos
    const multiFilesFolder = zip.folder("multiple_files");
    multiPathData.forEach((fileData) => {
        multiFilesFolder.file(fileData.filename, fileData.blob, { type: "text/plain" });
        // Supondo que você queira incluir coordenadas como texto no mesmo arquivo, ajuste conforme necessário
    });

    // Adicionar imagem
    if (cropped_image_data_url) {
        // Converter Data URL para Blob
        fetch(cropped_image_data_url).then(res => res.blob()).then(blob => {
            zip.folder("image").file(filenameImg, blob, { type: "image/png" }); // Ajuste o tipo conforme necessário

            // Gerar arquivo ZIP e salvar
            zip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, "route_files.zip");
            });
        });
    }

}




// ================================================================================================== OTHER ROUTINES: CLEAN MAP, PRINT SCREEN, ETC ================================================================================================== //

function clearMap() {
    cleanLayers();
    cleanFields();
    cleanPolygon();
}

// CLEANING ROUTES AND AREAS 

function cleanLayers() {

    var layers = ['txtPath', 'intrmdt', 'brkpnt', 'ultimatePath'];

    // Limpando todos os layers contidos no mapa
    for (i = 0; i < layers.length; i++) {
        var mapLayer = map.getLayer(layers[i]);

        if (typeof mapLayer !== 'undefined') {
            map.removeLayer(layers[i]).removeSource(layers[i]);
        }
    }
}

function cleanLayerById(id) {
    var mapLayer = map.getLayer(id);

    if (typeof mapLayer !== 'undefined') {
        map.removeLayer(id).removeSource(id);
    }
}

function cleanLayerById(id) {
    var mapLayer = map.getLayer(id);
    if (typeof mapLayer !== 'undefined') {
        map.removeLayer(id).removeSource(id);
    }
}

function cleanFields() {
    // Limpando o input file e os boxes de distância e tamanho da área
    document.getElementById('file-import-txt').value = "";
    document.getElementById('file-import-kml').value = "";
    document.getElementById('file-import-poly').value = "";
    document.getElementById('file-import-path').value = "";

    document.getElementById('calculated-distance').innerHTML = '0 Km';
    document.getElementById('calculated-time').innerHTML = '0 s';
    document.getElementById('calculated-area').innerHTML = '0 ha';

    document.getElementById('altitude').value = 10;
    document.getElementById('speed').value = 8;
    document.getElementById('distance').value = 50;

    document.getElementById('label-altitude').innerHTML = "Altitude: 10m";
    document.getElementById('label-speed').innerHTML = "Velocidade: 8m/s";
    document.getElementById('label-distance').innerHTML = "Distância: 50m";
}

function cleanPolygon() {
    draw.deleteAll();
}

// Cropper modal close button
const btnCloseSavingBar = document.getElementById("btn-close-saving-bar");
btnCloseSavingBar.addEventListener("click", function () {
    document.getElementById("saving-bar").classList.add("hidden");
});

function showAlert(type, message) {

    if (type === "error") {
        alert.classList.remove("bg-red-500", "bg-green-500");
        alert.classList.add("bg-red-500");
    } else if(type === "success") {
        alert.classList.remove("bg-red-500", "bg-green-500");
        alert.classList.add("bg-green-500");
    }

    alertMessage.innerHTML = "";
    alertMessage.innerHTML = message;

    alert.classList.remove("show-alert");

    setTimeout(() => {
        alert.classList.add("show-alert");
    }, "500"); 
}