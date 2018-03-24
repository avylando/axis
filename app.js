'use strict';

(function() {
    
    let minA = 6;
    let maxA = 9;
    let a = Math.floor(Math.random() * (maxA - minA + 1)) + minA;

    let minSum = 11;
    let maxSum = 14;
    let sum = Math.floor(Math.random() * (maxSum - minSum + 1)) + minSum;

    let b = sum - a;
    let minB = minSum - maxA;
    let maxB = maxSum - minA;

    let container = document.querySelector('.container');
    let aElement = container.querySelector('.a');
    let bElement = container.querySelector('.b');
    let sumElement = container.querySelector('.sum');
    let ctx = document.querySelector('#canvas').getContext('2d');
    
    aElement.textContent = a;
    bElement.textContent = b;

    ctx.strokeStyle = '#ED1D30';
    ctx.lineWidth = 2;
    ctx.beginPath();

    function counterMap(key, getBlock) {
        getBlock = getBlock || false;

        if (getBlock) {
            switch (key) {
                case 0: return aElement;
                case 1: return bElement;
                default: return false;
            }
        }

        switch (key) {
            case 0: return a;
            case 1: return b;
            default: return false;
        }
    }
    
    function renderArrow(start) {
        ctx.moveTo(start, 200);
        ctx.lineTo((start - 10), 192);
        ctx.moveTo(start, 200);
        ctx.lineTo((start + 4), 188);
    }

    function renderCurve(cb) {
        let counter = 0;
        let startX = 37;
        const endY = 200;
        const step = 39;

        return function () {
            let value = counterMap(counter);
            let mY = 70 + (50*counter);
            let k = value * step;
            let endX = startX + k;
            let mx1 = startX + (step/2);
            let mx2 = endX - (step/2);
            let middleX = (startX + endX) / 2;

            ctx.moveTo(startX, endY);

            ctx.bezierCurveTo(mx1, mY, mx2, mY, endX, endY);
            renderArrow(endX);

            startX = endX;
            
            setTimeout(function() {
                ctx.stroke();
                cb(middleX, mY, value, counter);
                counter++;
            }, 600);
        }
    }

    function createInput (x, y) {
        let input = document.createElement('input');
        input.type = 'text';
        input.maxLength = '2';
        input.style.left = x + 'px';
        input.style.top = y + 'px';

        return input;
    }

    function createLabel(x, y, val) {
        let label = document.createElement('div');
        label.className = 'label';
        label.style.left = (x + 10) + 'px';
        label.style.top = (y + 4) + 'px';
        label.textContent = val;

        return label;
    }

    function inputValid(input, curVal, val, field) {
        field = field || null;

        if (parseInt(curVal, 10) === val) {
            return true;
        }
        
        if (curVal === '') {
            input.style.color = '#000000';
            if (field) {
                field.style.backgroundColor = 'transparent';
            };

        } else if (parseInt(curVal, 10) !== val){

            input.style.color = '#ED1D30';
            if (field) {
                field.style.backgroundColor = '#EDAC31';
            }
        }

        return false;
    }

    function disableInput(input, field) {
        field = field || null;
        if (field) {
            field.style.backgroundColor = 'transparent';
        }
        
        input.style.opacity = '0';
        input.disabled = 'true';
    }

    function renderFields(x, y, val, counter) {
        let coordX = x - 15;
        let coordY = container.clientHeight + (y - 260 - y/4);
        let input = createInput(coordX, coordY);
        let label = createLabel(coordX, coordY, val);
        let field = counterMap(counter, true);

        container.appendChild(input);
        input.focus();

        input.addEventListener('input', function() {
            let validity = inputValid(input, input.value, val, field);

            if (validity) {
                setTimeout(function() {
                    disableInput(input, field);
                    container.appendChild(label);

                    let nextEl = counterMap(counter+=1);

                    if (nextEl) {
                        startApp();

                    } else {
                        let coordX = sumElement.offsetLeft - 2;
                        let coordY = sumElement.offsetTop + 6;

                        let input = createInput(coordX, coordY);
                        input.className = 'ext';
                        container.appendChild(input);
                        input.focus();

                        input.addEventListener('input', function() {
                            let validity = inputValid(input, input.value, sum);

                            if (validity) {
                                setTimeout(function() {
                                    disableInput(input);
                                    sumElement.textContent = sum;
                                }, 200);
                            }
                        });
                    }
                }, 200);
            }
        })
    }

    let startApp = renderCurve(renderFields);

    startApp();
})();