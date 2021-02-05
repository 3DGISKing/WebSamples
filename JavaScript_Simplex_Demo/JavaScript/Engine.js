var IsothermType = "Unknown";
var T, P, Q; // experiment data
var IP, IP_number;

var R1 = 8.31451; // kJ/(kmol.K)
var i;

function getData() {
    IP_number = 4;
    IP = new Array(IP_number);
    IP.fill(0);

    T = [343.15, 343.15, 343.15, 343.15, 343.15, 343.15, 343.15, 343.15, 343.15, 343.15,
        343.15,  343.15, 343.15, 343.15, 357.85, 357.85, 357.85, 357.85, 357.85, 357.85,
        357.85, 357.85,  357.85, 357.85, 357.85, 357.85, 372.65, 372.65, 372.65, 372.65,
        372.65, 372.65, 372.65,  372.65, 372.65, 372.65, 372.65, 372.65];

    P = [0.0027399, 0.0039239, 0.0049119, 0.0057545, 0.0068732, 0.0083651, 0.0100251, 0.0118437, 0.013893, 0.0180662,
        0.025146,   0.0368391, 0.0511987, 0.0676383, 0.0031359, 0.0042279, 0.0064212, 0.0092184, 0.0135063, 0.0192262,
        0.0276526, 0.0363591, 0.0443456,  0.054212,  0.067705,  0.079678,  0.0025999, 0.0047079, 0.0074998, 0.0106971,
        0.0148663, 0.0204795, 0.0265327, 0.0350791, 0.0454255,  0.0534653, 0.0636251, 0.0786914];

    Q = [0.00025943, 0.00037073, 0.00048208, 0.0005923,  0.00075091, 0.00095503, 0.00112974, 0.001256,   0.0013555,  0.00147263,
         0.00158506, 0.00168856, 0.00177859, 0.00185699, 0.00017702, 0.00022515, 0.00033245, 0.00049602, 0.00078354, 0.00110738,
         0.00132018, 0.00146626, 0.00154132, 0.00161173, 0.00168236, 0.00173666, 0.00010119, 0.0001512,  0.00022068, 0.00030828,
         0.00043637, 0.00063302, 0.00084389, 0.00107483, 0.00124766, 0.00134549, 0.0014216,  0.001514];
}

function main() {
    var initialIP = new Array(IP.length);

    initialIP.fill(0);

    InitialGuess_Langmuir(T, P, Q, initialIP);

    IP[0] = initialIP[0];
    IP[2] = initialIP[1];

    var EstRound = 0;

    var prevIP = new Array(IP.length);

    var chkSuccessive = true;

    while (true) {
        EstRound = EstRound + 1;

        console.log("iteration:" + EstRound);

        if(EstRound > 200) {
            console.warn("This estimation diverges....");
            break;
        }

        NMead(IsothermType, T, P, Q, IP);

        if(chkSuccessive) {
            var sum = 0;

            for (i = 0 ; i < IP.length; i++)
                sum = sum + Math.pow(((IP[i] - prevIP[i]) / IP[i]), 2);

            if(sum <= 0.000001)
                break;

            prevIP = IP.slice();
        }
    }

    for(i = 0; i < IP.length; i++)
        console.log("IP" + i + "=" + IP[i]);
}

/**
 *
 * @param {Array} T
 * @param {Array} P
 * @param {Array} Q
 * @param {Array} IP
 */
function InitialGuess_Langmuir(T, P, Q, IP) {
    var DataCount = T.length;

    var P_ = new Array(DataCount);
    var Q_ = new Array(DataCount);

    for (i = 0; i < DataCount; i++) {
        P_[i] = 1 / P[i];
        Q_[i] = 1 / Q[i];
    }

    var ret = LSTSQ(P_, Q_);

    var a = ret.slope;
    var b = ret.intercept;

    IP[0] = 1 / b;
    IP[1] = 1 / IP[0] / a;
}

/**
 *
 * @param {Array} x
 * @param {Array} y
 * @returns {{slope: number, intercept: number}}
 */

function LSTSQ(x, y) {
    if(x.length != y.length)
        console.error("invalid data");

    var term1 = 0;
    var term2 = 0;
    var term3 = 0;
    var term4 = 0;

    for (i = 0; i < x.length; i++) {
        term1 = term1 + x[i] * y[i];
        term2 = term2 + x[i];
        term3 = term3 + y[i];
        term4 = term4 + x[i] * x[i];
    }

    var n = x.length;

    var a = (n * term1 - term2 * term3) / (n * term4 - term2 * term2);
    var b = (term4 * term3 - term1 * term2) / (n * term4 - term2 * term2);

    return {
        slope: a,
        intercept: b
    }
}

function ErrNM(x, n, Tolerance) {
    if(Tolerance == undefined)
        Tolerance = 0.0000000001;

    for (var jj = 0; jj < n; jj++) {
        for (var ii = 0; ii < n; ii++) {
            if (Math.abs(1 - x[ii + 1][jj] / x[ii][jj]) >= Tolerance)
                return false;
        }
    }

    return true;
}

// replace Xnlow with Xnhy
function Insert(nhy, nlow, x, f, n) {
    var i, j, k;

    // replace x0 with x1,
    // replace x1 with x2 ... until nlow
    if (nlow != 0) {
        for (i = 1; i <= nlow; i++) {
            j = i - 1;
            f[j] = f[i];

            for (k = 0; k < n; k++)
                x[j][k] = x[i][k];
        }
    }

    f[nlow] = f[nhy];

    for(k = 0; k < n; k++)
        x[nlow][k] = x[nhy][k];
}

function Order(x, f, n) {
    var temp;

    var np1, j, k, lowIndex, jm1, l;

    np1 = n + 1;
    j = 0;

    do {
        j = j + 1;
        lowIndex = j - 1;
        k = j - 1;

        do {
            k = k + 1;

            if (f[lowIndex] > f[k])
                continue;

            lowIndex = k;
        }
        while(k < np1 - 1);

        jm1 = j - 1;

        // swap

        for(l = 0; l < n; l++) {
            temp = x[jm1][l];
            x[jm1][l] = x[lowIndex][l];
            x[lowIndex][l] = temp;
        }

        temp = f[jm1];
        f[jm1] = f[lowIndex];
        f[lowIndex] = temp;
    }
    while(j < np1 - 1);
}

/**
 *
 * @param {String} Isotherm
 * @param {Number} startXIndex start index
 * @param {Number} endXIndex length of f or x 의
 * @param {*} x two dimensional array
 * @param {Array} f
 * @param {*} n length of x 's first dimesion 곁수의 개수
 * @param {Array} T
 * @param {Array} P
 * @param {Array} Q
 */

function Func(Isotherm, startXIndex, endXIndex, x, f, n, T, P, Q) {
    var ans = new Array(n);

    for(let i = startXIndex; i <= endXIndex; i++) {
        var error = 0;

        for (let j = 0; j < T.length; j++) {
            var ret = Estimation_IsothermModel(Isotherm, T[j], P[j], Q[j], x[i]);

            error = error + ret.Del * ret.Del;
        }

        var DataCount = T.length;

        error = error / DataCount;

        f[i] = error;
    }
}

/**
 * 전체 실험자료에 대하여 오차를 계산한다
 * @param {String} Isotherm
 * @param {Array} parameters model 's parameters
 * @param {Array} T
 * @param {Array} P
 * @param {Array} Q
 * @return {Number}  주어진 파라메터를 가지고 실험값과 모형값사이의 오차를 계산해서 돌린다
 */
function NSolv(Isotherm, parameters, T, P, Q) {
    var error = 0;

    for (let i = 0; i < T.length; i++) {
        var ret = Estimation_IsothermModel(Isotherm, T[i], P[i], Q[i], parameters);

        error = error + ret.Del * ret.Del;
    }

    var DataCount = T.length;

    error = error / DataCount;

    return error;
}


/**
 * 한개 실험자료에 대해서 오차를 계산한다
 * @param {String} Isotherm represent Langmuir adsorption model
 * @param {Number} T        temperature
 * @param {Number} P        pressure
 * @param {Number} Q
 * @param {Array}  IP       model 's parameters
 * @return {Object}         difference between model 's value and experimental value
 */

function Estimation_IsothermModel(Isotherm, T, P, Q, IP) {
    var m = 0, b = 0;
    var Pcal = 0, Qcal = 0, Del = 0;

    switch(Isotherm){
        case "Langmuir (Temp)":
            m = IP[0] + IP[1] * T;
            b = IP[2] * Math.exp(IP[3] / R1 / T); // '  --> original form
            //'b = IP(3) * Math.Exp(IP(4) / R1 * (1 / T - 1 / Tref))  '  --> best form for estimation
            Pcal = P;
            Qcal = m * b * P / (1 + b * P);
            Del = (Q - Qcal) / Q;
			break;
    }

    return {
        Pcal: Pcal,
        Qcal: Qcal,
        Del: Del,
        Dev: Math.abs(Del) * 100
    };
}

/**
 *
 * @param {String} Isotherm
 * @param {Array}  T        array of Double
 * @param {Array}  P        array of Double
 * @param {Array}  Q        array of Double
 * @param {Array}  a        array of Double, ByRef 파라메터
 */

function NMead(Isotherm, T, P, Q, a) {
    var n = a.length;
    var DataCount = T.length;
    var MaxIteration = 100000;
    var Tolerance = 0.0000000001;

    var x = new Array(n + 4);

    for(var i = 0; i < x.length; i++) {
        x[i] = new Array(n);
        x[i].fill(0);
    }

    var f = new Array(n + 4); f.fill(0);

    var iterationCount, ic, ic1, j, k, np1, centroid, reflected, expanded;

    var alpha, beta, gama, h, fxc;

    alpha = 1;   // reflection
    beta = 0.55; // contraction
    gama = 2;    // expansion

    h = 0.00001; //txtInitialSimplex;

    np1 = n + 1;
    centroid = n + 1;
    reflected = n + 2;
    expanded = n + 3;

    // prepare x0
    for (j = 0; j < n; j++)
        x[0][j] = a[j];

    // prepare x1, x2 ... xn
    for (j = 1; j < np1; j++)
        for (k = 0; k < n; k++) {
            x[j][k] = x[0][k];

            if (k != j - 1)
                continue;

            if (x[j][k] == 0)
                x[j][k] = h;
            else
                x[j][k] = x[j][k] * (1 + h);
        }

    Func(Isotherm, 0, n, x, f, n, T, P, Q);
    Order(x, f, n);

    iterationCount = 0;

    iteration:

    do {
        iterationCount = iterationCount + 1;

        if (iterationCount > MaxIteration) {
            fxc = 1.0E+99;
            return;
        }

        for (j = 0; j < n ; j++) {
            // calculate centroid of all points except x0

            x[centroid][j] = 0;

            for(i = 1; i < np1; i++) {
                x[centroid][j] = x[centroid][j] + x[i][j] / n;
            }

            // calculate reflected
            x[reflected][j] = x[centroid][j] * (1 + alpha) - alpha * x[0][j];
        }

        // calculate error function value
        Func(Isotherm, reflected, reflected, x, f, n, T, P, Q);

        // If the reflected point(ny2) is best point so far
        // then compute the expanded point
        if (f[reflected] < f[n])
        {
            for (j = 0; j < n; j++)
                x[expanded][j] = gama * x[reflected][j] + (1 - gama) * x[centroid][j];

            Func(Isotherm, expanded, expanded, x, f, n, T, P, Q);

            // If the expanded point ny3 is better than the reflected point ny2
            if (f[expanded] < f[reflected]) {
                // then obtain a new simplex by replacing the worst point {\displaystyle \mathbf {x} _{n+1}}
                Insert(expanded, n, x, f, n); // 70
            }
            else{
                // else obtain a new simplex by replacing the worst point
                Insert(reflected, n, x, f, n); // 80
            }

            if (ErrNM(x, n))
                break;
            else
                continue;
        }

        // update x if reflected
        for(ic1 = 1; ic1< n; ic1++){
            ic = n - ic1;

            if (f[reflected] < f[ic]) {
                Insert(reflected, ic, x, f, n);

                if (ErrNM(x, n))
                    break iteration;
                else
                    continue iteration;
            }
        }

        if(f[reflected] < f[0])
            Insert(reflected, 0, x, f, n);

        for(j = 0; j < n; j++)
            x[expanded][j] = beta * x[0][j] + (1 - beta) * x[centroid][j];

        Func(Isotherm, expanded, expanded, x, f, n, T, P, Q);

        if (f[expanded] < f[0]) {
            for (ic1 = 1; ic1 < n; ic1++) {
                ic = np1 - ic1;

                if (f[expanded] <= f[ic]) {
                    Insert(expanded, ic, x, f, n);

                    if (ErrNM(x, n))
                        break iteration;
                    else
                        continue iteration;
                }
            }

            Insert(expanded, ic - 1, x, f, n);

            if (ErrNM(x, n))
                break;
            else
                continue;
        }

        for (k = 0; k < n; k++)
            for (j = 0; j < n; j++)
                x[k][j] = 0.5 * (x[k][j] + x[n][j]);

        Func(Isotherm, 0, n, x, f, n, T, P, Q);
        Order(x, f, n);

        if (ErrNM(x, n))
            break;
    }
    while(true);

    Func(Isotherm, centroid, centroid, x, f, n, T, P, Q);

    for (j = 0; j < n; j++)
        a[j] = x[n][j];

    fxc = NSolv(Isotherm, a, T, P, Q);

    console.log(fxc);
}


