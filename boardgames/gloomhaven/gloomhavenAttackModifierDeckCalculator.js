var cards;

initCards();
initChart();
updateProbabilities();

function Card(cardIndex, name, additionModifier, multiplierModifier, initialCount) {
    this.cardIndex = cardIndex;
    this.name = name;
    this.additionModifier = additionModifier;
    this.multiplierModifier = multiplierModifier;
    this.initialCount = initialCount;
    this.count = initialCount;
    this.probability = 0.0;
}

function initCards() {
    cards = [
        new Card(0, "Miss", 0, 0, 1),
        new Card(1, "-2", -2, 1, 1),
        new Card(2, "-1", -1, 1, 4),
        new Card(3, "0", 0, 1, 5),
        new Card(4, "+1", 1, 1, 4),
        new Card(5, "+2", 2, 1, 1),
        new Card(6, "Double", 0, 2, 1)
    ];
}

function resetDeck() {
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        card.count = card.initialCount;
    }
    updateProbabilities();
}

function updateProbabilities() {
    var countTotal = 0;
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        countTotal += card.count;
    }
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        card.probability = card.count / countTotal;
    }
    updateChart();
}

function initChart() {
    outerSize = {width: 400, height: 300};
    margin = {top: 20, right: 30, bottom: 40, left: 40};
    barButtonCount = 3;
    barButtonSize = {width: 20, height: 20};
    innerSize = {width: outerSize.width - margin.left - margin.right,
        height: outerSize.height - margin.top - margin.bottom - (barButtonCount * barButtonSize.height)};

    chart = d3.select(".chart")
            .attr("width", outerSize.width)
            .attr("height", outerSize.height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xRange = d3.scaleBand()
            .domain(d3.range(0, cards.length))
            .range([0, innerSize.width])
            .padding(0.1);
    chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerSize.height + ")")
            .call(d3.axisBottom().scale(xRange));
    chart.append("text")
            .attr("transform",
                    "translate(" + (innerSize.width / 2) + " ," + (innerSize.height + margin.top + 15) + ")")
            .style("text-anchor", "middle")
            .text("Card");

    yRange = d3.scaleLinear()
            .domain([0, 1])
            .range([innerSize.height, 0]);
    chart.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft().scale(yRange));
    chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (innerSize.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Probability");

    var cardBar = chart.selectAll(".cardBar")
            .data(cards)
            .enter().append("g")
            .attr("class", "cardBar");

    probabilityBar = cardBar.append("rect")
            .attr("class", "probabilityBar")
            .attr("x", function (card) {
                return xRange(card.cardIndex);
            })
            .attr("width", xRange.bandwidth());
}

function createButton(cardBar, svgFile, toolTip, xFunction, yFunction, clickFunction) {
    cardBar.append("image")
            .attr("xlink:href",svgFile)
            .attr("class", "barButton")
            .attr("x", xFunction)
            .attr("width", xRange.bandwidth())
            .attr("y", yFunction)
            .attr("height", barButtonSize.height)
            .on("click", clickFunction)
            .append("title").text(toolTip);
    var button = cardBar
            .append("rect")
            .attr("class", "barButtonGrayScaleHack")
            .attr("x", xFunction)
            .attr("width", xRange.bandwidth())
            .attr("y", yFunction)
            .attr("height", barButtonSize.height)
            .on("click", clickFunction);
    button.append("title").text(toolTip);
    return button;
}


function updateChart() {
    probabilityBar
            .attr("y", function (card) {
                return yRange(card.probability);
            })
            .attr("height", function (card) {
                return innerSize.height - yRange(card.probability);
            });
}
