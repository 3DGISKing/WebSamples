var R1 = 8.31451; // kJ/(kmol.K)

function findLineByLeastSquares(x, y) {
    if(x.length != y.length)
        console.error("invalid data");

    var term1 = 0;
    var term2 = 0;
    var term3 = 0;
    var term4 = 0;

    for (var i = 0; i < x.length; i++) {
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

var Langmuir = {};

Langmuir.guessInitialFuncs  = {};

Langmuir.guessInitialFuncs.Linear =
    function (T, P, Q) {
        var dataCount = T.length;

        var P_ = new Array(dataCount);
        var Q_ = new Array(dataCount);

        for (var i = 0; i < dataCount; i++) {
            P_[i] = P[i];
            Q_[i] = Q[i];
        }

        var ret = findLineByLeastSquares(P_, Q_);

        var a = ret.slope;
        var b = ret.intercept;

        var IP = new Array(this.parameterCount);

        IP.fill(0);

        IP[0] = a;
        IP[1] = b;

        return IP
    };

Langmuir.guessInitialFuncs.Langmuir =
    function (T, P, Q) {
        var dataCount = T.length;

        var P_ = new Array(dataCount);
        var Q_ = new Array(dataCount);

        for (var i = 0; i < dataCount; i++) {
            P_[i] = 1 / P[i];
            Q_[i] = 1 / Q[i];
        }

        var ret = findLineByLeastSquares(P_, Q_);

        var a = ret.slope;
        var b = ret.intercept;

        var IP = new Array(this.parameterCount);

        IP.fill(0);

        IP[0] = 1 / b;
        IP[1] = 1 / IP[0] / a;

        return IP
  };

Langmuir.guessInitialFuncs.Freundlich =
    function (T, P, Q) {
        var P_ = new Array(T.length);
        var Q_ = new Array(T.length);

        for (var i = 0; i < T.length; i++) {
            P_[i] = Math.log(P[i]);
            Q_[i] = Math.log(Q[i]);
        }

        var ret = findLineByLeastSquares(P_, Q_);

        var a = ret.slope;
        var b = ret.intercept;

        var IP = [0, 0];

        IP[0] = Math.exp(b);
        IP[1] = a;

        return IP;
    };

Langmuir.guessInitialFuncs.Langmuir_Freundlich =
    function (T, P, Q) {
        var Qmax = Math.max.apply(null, Q);

        var IP = [0, 0, 0];

        IP[0] = Qmax * 1.001;

        var dataCount = T.length;

        var P_ = new Array(dataCount);
        var Q_ = new Array(dataCount);
        var Qcal = new Array(dataCount);
        var Err = new Array(dataCount);

        var ErrSips = 100;
        var iterMax = 1000;
        var iter = 0;
        var AvgDev;

        do
        {
            for (var i = 0; i < dataCount; i++) {
                P_[i] = Math.log(P[i]);
                Q_[i] = Math.log((Q[i] / IP[0]) / (1 - (Q[i] / IP[0])));
            }

            var ret = findLineByLeastSquares(P_, Q_);

            var a = ret.slope;
            var b = ret.intercept;

            IP[1] = Math.exp(b);
            IP[2] = a;

            var ErrSum = 0;

            for (var i = 0;i < dataCount; i++)
            {
                Qcal[i] = IP[0] * IP[1] * Math.pow(P[i], IP[2]) / (1 + IP[1] * Math.pow(P[i], IP[2]));
                Err[i] = Math.abs(Q[i] - Qcal[i]) / Q[i] * 100;
                ErrSum = ErrSum + Err[i];
            }

            AvgDev = ErrSum / dataCount;

            if ((AvgDev >= ErrSips) || (iter > iterMax))
                return IP;

            ErrSips = AvgDev;
            IP[0] = IP[0] * 1.01;
            iter = iter + 1;
        }
        while (true);
    };

Langmuir.Model = (function () {
    function Model(options) {
        this.label = options.label;
        this.parameterCount = options.parameterCount;
        this.P = options.P;
        this.Q = options.Q;
        this.guessInitialFunc = options.guessInitialFunc;
        this.initModel = options.initModel;
        this.modifyInitialValueFunc = options.modifyInitialValueFunc;
        this.checkEstimationTerminateFunc = options.checkEstimationTerminateFunc;
        this.estimateDirectlyFunc = options.estimateDirectlyFunc;
        this.directEstimate = options.directEstimate;
    }

    Model.prototype.errorValue = function (T, P, Q, IP) {
        var Pcal = P;

        if (this.P) {
            IP.unshift(0);

            Pcal = this.P(T, Q, IP);

            IP.shift();
        }

        var Qcal = Q;

        if(this.Q) {
            IP.unshift(0);

            Qcal = this.Q(T, P, IP);

            IP.shift();
        }

        if(this.Q != undefined)
            return (Q - Qcal) / Q;
        else
            return (P - Pcal) / P;
    };

    Model.prototype.initialValue = function (T, P, Q) {
        var IP = new Array(this.parameterCount);

        IP.fill(0);

        var IP_ini;

        if(this.guessInitialFunc)
            IP_ini = this.guessInitialFunc(T, P, Q);

        if(this.initModel){
            var model = Langmuir.model(this.initModel);

            IP_ini = model.estimate(T, P, Q, 200, true, 0.000001);
        }

        if(this.modifyInitialValueFunc){
            // start index in 0 in JavaScript but 1 in VB

            IP.unshift(0);
            IP_ini.unshift(0);

            this.modifyInitialValueFunc(IP, IP_ini, T, P, Q);

            IP.shift();
        }
        else {
            IP = IP_ini;

            if(IP.length < this.parameterCount)
            {
                for (var i = 0; i < this.parameterCount - IP.length; i++)
                    IP.push(0);
            }
        }

        return IP;
    };

    Model.prototype.estimate = function (T, P, Q, checkConstraint) {
        if(this.estimateDirectlyFunc != undefined)
            return this.estimateDirectlyFunc(this, T, P, Q);

        var options = {
            maxIteration: 200,
            tolerance: 0.000001
        };

        var maxIteration = options.maxIteration;
        var tolerance = options.tolerance;

        var self = this;

        function errorFunc(X) {
            var error = 0;

            for (var i = 0; i < T.length; i++) {
                error = error + self.errorValue(T[i], P[i], Q[i], X) * self.errorValue(T[i], P[i], Q[i], X);
            }

            error = error / T.length;

            return error;
        }

        var IP = this.initialValue(T, P, Q);

        var prevIP = IP.slice();

        var iteration = 0;

        var nelderMeadOptions = {
            maxIterations: 100000,
            nonZeroDelta: 1.00001,
            zeroDelta:    0.00001,
            minErrorDelta: 0.0000000001,
            minTolerance: 0.0000000001,
            rho: 1,
            chi: 2,
            psi: -0.5,
            sigma: 0.55
        };

        while (true) {
            iteration = iteration + 1;

            if(iteration > maxIteration) {
                console.warn("This estimation diverges....");
                break;
            }

            var solution = fmin.nelderMead(errorFunc, IP, nelderMeadOptions);

            console.log(solution.fx);

            IP = solution.x;

            if(checkConstraint && this.checkEstimationTerminateFunc != undefined) {
                IP.unshift(0);

                while (this.checkEstimationTerminateFunc(IP)) {
                    IP.shift();
                    solution = fmin.nelderMead(errorFunc, IP, nelderMeadOptions);

                    IP = solution.x;

                    IP.unshift(0);
                }

                IP.shift();
            }

            if(checkConstraint) {
                var sum = 0;

                for (var i = 0 ; i < this.parameterCount; i++)
                    sum = sum + Math.pow(((IP[i] - prevIP[i]) / IP[i]), 2);

                if(sum <= tolerance)
                    break;

                prevIP = IP.slice();
            }
        }

        delete IP.id;
        delete IP.fx;

        return IP;
    };

    return Model;
})();

Langmuir.models = [];

var options = {
    label: "Langmuir",
    parameterCount: 2,
    guessInitialFunc: Langmuir.guessInitialFuncs.Langmuir,
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir (Temp)",
    parameterCount: 4,
    guessInitialFunc: Langmuir.guessInitialFuncs.Langmuir,
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[3] = IP_ini[2];
    },
    Q: function (T, P, IP) {
        var m = IP[1] + IP[2] * T;
        var b = IP[3] * Math.exp(IP[4] / R1 / T); // '  --> original form

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Two Site Langmuir",
    parameterCount: 4,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2];
        IP[3] = IP_ini[1] / 2;
        IP[4] = IP_ini[2];
    },
    Q: function (T, P, IP) {
        var m1 = IP[1];
        var b1 = IP[2];
        var m2 = IP[3];
        var b2 = IP[4];

        return  m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Two Site Langmuir (Temp)",
    parameterCount: 8,
    initModel: "Langmuir (Temp)",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2] / 2;
        IP[3] = IP_ini[3] / 2;
        IP[4]= IP_ini[4];
        IP[5] = IP_ini[1] / 2;
        IP[6] = IP_ini[2] / 2;
        IP[7] = IP_ini[3] / 2;
        IP[8] = IP_ini[4];
    },
    Q: function (T, P, IP) {
        var m01 = IP[1];
        var m11 = IP[2];
        var b01 = IP[3];
        var b11 = IP[4];
        var m02 = IP[5];
        var m12 = IP[6];
        var b02 = IP[7];
        var b12 = IP[8];
        var m1 = m01 + m11 * T;
        var b1 = b01 * Math.exp(b11 / R1 / T);
        //b1 = b01 * Math.Exp(b11 / R1 * (1 / T - 1 / Tref))
        var m2 = m02 + m12 * T;
        var b2 = b02 * Math.exp(b12 / R1 / T);
        //b2 = b02 * Math.Exp(b12 / R1 * (1 / T - 1 / Tref))

        return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Three Site Langmuir",
    parameterCount: 6,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 3;
        IP[2] = IP_ini[2] * 0.1;
        IP[3] = IP_ini[1] / 3;
        IP[4] = IP_ini[2] * 0.1;
        IP[5] = IP_ini[1] / 3;
        IP[6] = IP_ini[2] * 0.1;
    },
    Q: function (T, P, IP) {
        var m1 = IP[1];
        var b1 = IP[2];
        var m2 = IP[3];
        var b2 = IP[4];
        var m3 = IP[5];
        var b3 = IP[6];

        return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P) + m3 * b3 * P / (1 + b3 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Three Site Langmuir (Temp)",
    parameterCount: 12,
    initModel: "Langmuir (Temp)",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 3;
        IP[2] = IP_ini[2] / 3;
        IP[3] = IP_ini[3] / 3;
        IP[4] = IP_ini[4]; // '* 0.1
        IP[5] = IP_ini[1] / 3;
        IP[6] = IP_ini[2] / 3;
        IP[7] = IP_ini[3] / 3;
        IP[8] = IP_ini[4]; //'* 0.1
        IP[9] = IP_ini[1] / 3;
        IP[10] = IP_ini[2] / 3;
        IP[11] = IP_ini[3] / 3;
        IP[12] = IP_ini[4]; // '* 0.1
    },
    Q: function (T, P, IP) {
       var m01 = IP[1];
       var m11 = IP[2];
       var b01 = IP[3];
       var b11 = IP[4];
       var m02 = IP[5];
       var m12 = IP[6];
       var b02 = IP[7];
       var b12 = IP[8];
       var m03 = IP[9];
       var m13 = IP[10];
       var b03 = IP[11];
       var b13 = IP[12];

       var m1 = m01 + m11 * T;
       var b1 = b01 * Math.exp(b11 / R1 / T);
       //b1 = b01 * Math.Exp(b11 / R1 * (1 / T - 1 / Tref))
       var m2 = m02 + m12 * T;
       var b2 = b02 * Math.exp(b12 / R1 / T);
       //b2 = b02 * Math.Exp(b12 / R1 * (1 / T - 1 / Tref))
       var m3 = m03 + m13 * T;
       var b3 = b03 * Math.exp(b13 / R1 / T);
       //'b3 = b03 * Math.Exp(b13 / R1 * (1 / T - 1 / Tref))

       return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P) + m3 * b3 * P / (1 + b3 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir-Freundlich",
    parameterCount: 3,
    guessInitialFunc: Langmuir.guessInitialFuncs.Langmuir_Freundlich,
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = IP_ini[3];
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];
        var c = IP[3];

        return m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir-Freundlich (Temp)",
    parameterCount: 6,
    initModel: "Langmuir-Freundlich",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[3] = IP_ini[2];
        IP[5] = IP_ini[3];
    },
    Q: function (T, P, IP) {
        var m = IP[1] + IP[2] * T;
        var b = IP[3] * Math.exp(IP[4] / R1 / T);
        var c = IP[5] + IP[6] / T;

        return m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Jensen-Seaton",
    parameterCount: 4,
    guessInitialFunc: Langmuir.guessInitialFuncs.Freundlich,
    initModel: "",
    Q: function (T, P, IP) {
        var a = IP[1];
        var b = IP[2];
        var c = IP[3];
        var k = 0;

        var xx = Math.pow((b * P) / (a * (1 + k * P)), c);

        return (b * P) / Math.pow(1 + xx , (1 / c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Toth",
    parameterCount: 3,
    guessInitialFunc: function () {

    },
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 1 / IP_ini[2];
        IP[3] = 1;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];
        var c = IP[3];

        var xx = b + Math.pow(P, c);

        return m * P / Math.pow(xx, (1 / c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "UNILAN",
    parameterCount: 3,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 10;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];
        var s = IP[3];

        return m / 2 / s * Math.log((b + P * Math.exp(+s)) / (b + P * Math.exp(-s)));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "UNILAN (Temp)",
    parameterCount: 5,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 1000000;
        IP[5] = 10;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        //m = m0 + m1 * T
        //m = m0 + Math.Exp(m1 / T)
        var m = m0 / Math.pow(T, m1);
        var b0 = IP[3];
        var Emax = IP[4];
        var Emin = IP[5];
        var b = b0 * Math.exp((Emax + Emin) / 2 / R1 / T);
        var s = (Emax - Emin) / 2 / R1 / T;

        return m / 2 / s * Math.log((b + P * Math.exp(+s)) / (b + P * Math.exp(-s)));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Martinez-Basmadjian (S-shape)",
    parameterCount: 5,
    initModel: "Jensen-Seaton",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] * 10;
        IP[2] = 0; //IP_ini(2)
        IP[3] = -T[1];
        IP[4] = IP_ini[3];
        IP[5] = 10;
    },
    P: function (T, Q, IP) {
        var theta = Q / IP[1];
        var term1 = Math.exp(-IP[3] / T + IP[4] * IP[5] * theta / T);
        var term2 = theta / Math.pow(1 - theta, IP[5]);

        return IP[2] * term1 * term2;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Virial3",
    parameterCount: 3,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini, T, P, Q) {
        IP[1] = R1 * T[1] * IP_ini[1] * IP_ini[2];
        IP[2] = IP_ini[1] * IP_ini[2];
        IP[3] = Q[Q.length - 1] * 1.1;
    },
    P: function (T, Q, IP) {
        var c1 = IP[1];
        var h = IP[2];
        var m = IP[3];

        return Q / h * (m / (m - Q)) * Math.exp(c1 * Q);
    },
    checkEstimationTerminateFunc: function (IP) {
        var ret = IP[2] < 0 || IP[3] < 0;

        if(ret) {
            IP[2] = Math.abs(IP[2]);
            IP[3] = Math.abs(IP[3]);
        }

        return ret;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Virial4",
    parameterCount: 4,
    initModel: "Virial3",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = IP_ini[3];
    },
    P: function (T, Q, IP) {
        var c1 = IP[1];
        var c2 = IP[2];
        var h = IP[3];
        var m = IP[4];

        return Q / h * (m / (m - Q)) * Math.exp(c1 * Q + c2 * Math.pow(Q, 2));
    },
    checkEstimationTerminateFunc: function (IP) {
        var ret = IP[3] < 0 || IP[4] < 0;

        if(ret) {
            IP[3] = Math.abs(IP[3]);
            IP[4] = Math.abs(IP[4]);
        }

        return ret;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Virial5",
    parameterCount: 5,
    initModel: "Virial4",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 0;
        IP[4] = IP_ini[3];
        IP[5] = IP_ini[4];
    },
    P: function (T, Q, IP) {
        var c1 = IP[1];
        var c2 = IP[2];
        var c3 = IP[3];
        var h = IP[4];
        var m = IP[5];

        return Q / h * (m / (m - Q)) * Math.exp(c1 * Q + c2 * Math.pow(Q, 2) + c3 * Math.pow(Q, 3));
    },
    checkEstimationTerminateFunc: function (IP) {
        var ret = IP[4] < 0 || IP[5] < 0;

        if(ret) {
            IP[4] = Math.abs(IP[4]);
            IP[5] = Math.abs(IP[5]);
        }

        return ret;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Modified Virial (S-shape)",
    parameterCount: 6,
    initModel: "Virial5",
    modifyInitialValueFunc: function (IP, IP_ini,T, P, Q) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = IP_ini[3];
        IP[4] = 0;
        IP[5] = IP_ini[4];
        IP[6] = Q[Q.length - 1] * 1.1;
    },
    P: function (T, Q, IP) {
        var c1 = IP[1];
        var c2 = IP[2];
        var c3 = IP[3];
        var c4 = IP[4];
        var h = IP[5];
        var m = IP[6];

        return Q / h * (m / (m - Q)) * Math.exp(c1 * Q + c2 * Math.pow(Q, 2) + c3 * Math.pow(Q, 3) + c4 * Math.pow(Q, 4));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Henry",
    parameterCount: 1,
    estimateDirectlyFunc: function (model, T, P, Q) {
        var IP = new Array(model.parameterCount);
        var SumXY, SumX2;

        SumXY = 0;
        SumX2 = 0;

        for (var i = 0; i < T.length; i++) {
            SumXY = SumXY + P[i] * Q[i];
            SumX2 = SumX2 + P[i] * P[i];
        }

        IP[0] = SumXY / SumX2;

        return IP;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Freundlich",
    parameterCount: 2,
    guessInitialFunc: Langmuir.guessInitialFuncs.Freundlich,
    Q: function (T, P, IP) {
        var k = IP[1];
        var c = IP[2];

        return k * Math.pow(P, c);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Flory-Huggins Vacancy Solution 1",
    parameterCount: 3,
    initModel: "Toth",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] * 2;
        IP[2] = IP_ini[2];
        IP[3] = 0;
    },
    P: function (T, Q, IP) {
        var m = IP[1];
        var b = IP[2];
        var a = IP[3];
        var theta = Q / m;

        return (m / b * theta / (1 - theta)) * Math.exp(a * a * theta / (1 + a * theta));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Flory-Huggins Vacancy Solution 2",
    parameterCount: 4,
    initModel: "Flory-Huggins Vacancy Solution 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 0;
        IP[4] = (IP_ini[3] + 1) / IP_ini[1];
    },
    P: function (T, Q, IP) {
        var m = IP[1];
        var b0 = IP[2];
        var b1 = IP[3];
        var b = b0 * Math.exp(b1 / R1 / T);
        var a0 = IP[4];
        var a = a0 * m - 1;
        var theta = Q / m;

        return (m / b * theta / (1 - theta)) * Math.exp(a * a * theta / (1 + a * theta));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Flory-Huggins Vacancy Solution 3",
    parameterCount: 5,
    initModel: "Flory-Huggins Vacancy Solution 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
        IP[5] = (IP_ini[3] + 1) / IP_ini[1];
    },
    P: function (T, Q, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 * Math.exp(m1 / T);
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / R1 / T);
        var a0 = IP[5];
        var a = a0 * m - 1;
        var theta = Q / m;

        return (m / b * theta / (1 - theta)) * Math.exp(a * a * theta / (1 + a * theta));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Wilson Vacancy Solution 1",
    parameterCount: 4,
    initModel: "Toth",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] * 2;
        IP[2] = IP_ini[2];
        IP[3] = 1;
        IP[4] = 1;
    },
    P: function (T, Q, IP) {
        var m = IP[1];
        var b = IP[2];
        var L13 = IP[3];
        var L31 = IP[4];
        var theta = Q / m;

        return (m / b * theta / (1 - theta)) * (L13 * (1 - (1 - L31) * theta) / (L13 + (1 - L13) * theta)) *
            Math.exp(-L31 * (1 - L31) * theta / (1 - (1 - L31) * theta) - (1 - L13) * theta / (L13 + (1 - L13) * theta));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Wilson Vacancy Solution 2",
    parameterCount: 5,
    initModel: "Wilson Vacancy Solution 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 0;
        IP[4] = IP_ini[3];
        IP[5] = IP_ini[4];
    },
    P: function (T, Q, IP) {
       var m = IP[1];
       var b0 = IP[2];
       var b1 = IP[3];
       var b = b0 * Math.exp(b1 / R1 / T);
       var L13 = IP[4];
       var L31 = IP[5];
       var theta = Q / m;

       return (m / b * theta / (1 - theta)) * (L13 * (1 - (1 - L31) * theta) / (L13 + (1 - L13) * theta))
        * Math.exp(-L31 * (1 - L31) * theta / (1 - (1 - L31) * theta) - (1 - L13) * theta / (L13 + (1 - L13) * theta));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Wilson Vacancy Solution 3",
    parameterCount: 6,
    initModel: "Wilson Vacancy Solution 2",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = IP_ini[3];
        IP[5] = IP_ini[4];
        IP[6] = IP_ini[5];
    },
    P: function (T, Q, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 * Math.exp(m1 / T);
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / R1 / T);
        var L13 = IP[5];
        var L31 = IP[6];
        var theta = Q / m;

        return (m / b * theta / (1 - theta)) * (L13 * (1 - (1 - L31) * theta) / (L13 + (1 - L13) * theta))
        * Math.exp(-L31 * (1 - L31) * theta / (1 - (1 - L31) * theta) - (1 - L13) * theta / (L13 + (1 - L13) * theta));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 1",
    parameterCount: 2,
    guessInitialFunc: Langmuir.guessInitialFuncs.Langmuir,
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 2",
    parameterCount: 3,
    initModel: "Langmuir 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 0;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b0 = IP[2];
        var b1 = IP[3];

        var b = b0 * Math.exp(b1 / T);

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 3",
    parameterCount: 4,
    initModel: "Langmuir 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 + m1 * T;
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 4",
    parameterCount: 4,
    initModel: "Langmuir 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 / Math.pow(T, m1);
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 5",
    parameterCount: 4,
    initModel: "Langmuir 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 * Math.exp(m1 / T);
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);

        return m * b * P / (1 + b * P);

    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Dual-Site Langmuir 1",
    parameterCount: 4,
    initModel: "Langmuir 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2] / 2;
        IP[3] = IP_ini[1] / 2;
        IP[4] = IP_ini[2] / 2;
    },
    Q: function (T, P, IP) {
        var m1 = IP[1];
        var b1 = IP[2];
        var m2 = IP[3];
        var b2 = IP[4];

        return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Dual-Site Langmuir 2",
    parameterCount: 6,
    initModel: "Langmuir 2",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2] / 2;
        IP[3] = IP_ini[3];
        IP[4] = IP_ini[1] / 2;
        IP[5] = IP_ini[2] / 2;
        IP[6] = IP_ini[3];
    },
    Q: function (T, P, IP) {
        var m1 = IP[1];
        var b01 = IP[2];
        var b11 = IP[3];
        var b1 = b01 * Math.exp(b11 / T);
        var m2 = IP[4];
        var b02 = IP[5];
        var b12 = IP[6];
        var b2 = b02 * Math.exp(b12 / T);

        return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Dual-Site Langmuir 3",
    parameterCount: 8,
    initModel: "Langmuir 3",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2] / 2;
        IP[3] = IP_ini[3] / 2;
        IP[4] = IP_ini[4];
        IP[5] = IP_ini[1] / 2;
        IP[6] = IP_ini[2] / 2;
        IP[7] = IP_ini[3] / 2;
        IP[8] = IP_ini[4];
    },
    Q: function (T, P, IP) {
        var m01 = IP[1];
        var m11 = IP[2];
        var m1 = m01 + m11 * T;
        var b01 = IP[3];
        var b11 = IP[4];
        var b1 = b01 * Math.exp(b11 / T);
        var m02 = IP[5];
        var m12 = IP[6];
        var m2 = m02 + m12 * T;
        var b02 = IP[7];
        var b12 = IP[8];
        var b2 = b02 * Math.exp(b12 / T);

        return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Sips 1",
    parameterCount: 3,
    initModel: "Langmuir-Freundlich",
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];
        var c = IP[3];

        return  m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Sips 2",
    parameterCount: 5,
    initModel: "Sips 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 0;
        IP[4] = IP_ini[3];
        IP[5] = 0;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b0 = IP[2];
        var b1 = IP[3];
        var b = b0 * Math.exp(b1 / T);
        var c0 = IP[4];
        var c1 = IP[5];
        var c = c0 + c1 / T;

        return m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Sips 3",
    parameterCount: 6,
    initModel: "Sips 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
        IP[5] = IP_ini[3];
        IP[6] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 + m1 * T;
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);
        var c0 = IP[5];
        var c1 = IP[6];
        var c = c0 + c1 / T;

        return m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Sips 4",
    parameterCount: 6,
    initModel: "Sips 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
        IP[5] = IP_ini[3];
        IP[6] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 / Math.pow(T, m1);
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);
        var c0 = IP[5];
        var c1 = IP[6];
        var c = c0 + c1 / T;

        return m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Sips 5",
    parameterCount: 6,
    initModel: "Sips 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
        IP[5] = IP_ini[3];
        IP[6] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 * Math.exp(m1 / T);
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);
        var c0 = IP[5];
        var c1 = IP[6];
        var c = c0 + c1 / T;

        return m * b * Math.pow(P, c) / (1 + b * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Toth 1",
    parameterCount: 3,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 1 / IP_ini[2];
        IP[3] = 1;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];
        var c = IP[3];

        var xx = b + Math.pow(P, c);

        return m * P / (Math.pow(xx, (1 / c)));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "UNILAN 1",
    parameterCount: 3,
    initModel: "Langmuir",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = 10;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b = IP[2];
        var s = IP[3];

        return m / 2 / s * Math.log((b + P * Math.exp(+s)) / (b + P * Math.exp(-s)));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Virial (S-shape)",
    parameterCount: 6,
    initModel: "Virial5",
    modifyInitialValueFunc: function (IP, IP_ini, T, P, Q) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = IP_ini[3];
        IP[4] = 0;
        IP[5] = IP_ini[4];
        IP[6] = Q[T.length - 1] * 1.1;
    },
    P: function (T, Q, IP) {
        var c1 = IP[1];
        var c2 = IP[2];
        var c3 = IP[3];
        var c4 = IP[4];
        var h = IP[5];
        var m = IP[6];

        return Q / h * (m / (m - Q)) * Math.exp(c1 * Q + c2 * Math.pow(Q, 2) + c3 * Math.pow(Q, 3) + c4 * Math.pow(Q, 4))
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Henry 1",
    parameterCount: 1,
    estimateDirectlyFunc: function (model, T, P, Q) {
        var IP = new Array(model.parameterCount);
        var SumXY, SumX2;

        SumXY = 0;
        SumX2 = 0;

        for (var i = 0; i < T.length; i++) {
            SumXY = SumXY + P[i] * Q[i];
            SumX2 = SumX2 + P[i] * P[i];
        }

        IP[0] = SumXY / SumX2;

        return IP;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Henry 2",
    parameterCount: 2,
    initModel: "Henry 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
    },
    Q: function (T, P, IP) {
        var h0 = IP[1];
        var h1 = IP[2];
        var h = h0 * Math.exp(h1 / T);

        return h * P;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Linear",
    parameterCount: 2,
    guessInitialFunc:  Langmuir.guessInitialFuncs.Linear,
    Q: function (T, P, IP) {
        var h = IP[1];
        var c = IP[2];

        return h * P + c;
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir-Freundlich (Gas)",
    parameterCount: 6,
    initModel: "Sips 1",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[3] = IP_ini[3];
        IP[4] = 0;
        IP[5] = IP_ini[2];
        IP[6] = 0;
    },
    Q: function (T, P, IP) {
        var m = IP[1];
        var b0 = IP[2];
        var c = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);
        var b0_ = IP[5];
        var b1_ = IP[6];
        var b_ = b0_ * Math.exp(b1_ / T);

        return m * b * Math.pow(P, c) / (1 + b_ * Math.pow(P, c));
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Freundlich 1",
    parameterCount: 2,
    guessInitialFunc: Langmuir.guessInitialFuncs.Freundlich,
    Q: function (T, P, IP) {
       var k = IP[1];
       var c = IP[2];

       return k * Math.pow(P, c);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Freundlich 2",
    parameterCount: 3,
    guessInitialFunc: Langmuir.guessInitialFuncs.Freundlich,
    Q: function (T, P, IP) {
        var k0 = IP[1];
        var c = IP[2];
        var k1 = IP[3];
        var k = k0 * Math.exp(k1 / T);

        return k * Math.pow(P, c);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Single Layer BET",
    parameterCount: 3,
    initModel: "Langmuir 1",
    Q: function (T, P, IP) {
        var m = IP[1];
        var b0 = IP[2];
        var b1 = IP[3];
        var b = b0 * Math.exp(b1 / T);

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Dual Layer BET",
    parameterCount: 4,
    initModel: "Single Layer BET",
    Q: function (T, P, IP) {
        return IP[1] * P * (
            IP[2] * Math.exp(IP[3] / T)
        / (1 + IP[2] * Math.exp(IP[3] / T) * P)
        + IP[2] * Math.exp(IP[3] / T) * IP[4] * IP[2] * Math.exp(IP[3] / T) * P
        / (1 + IP[2] * Math.exp(IP[3] / T) * P) / (1 + IP[4] * IP[2] * Math.exp(IP[3] / T) * P)
        );
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "BET",
    parameterCount: 6,
    initModel: "Single Layer BET",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] * IP_ini[2];
        IP[2] = IP_ini[3];
        IP[3] = IP_ini[2];
        IP[4] = IP_ini[3];
        IP[5] = IP_ini[2];
        IP[6] = IP_ini[3];
    },
    Q: function (T, P, IP) {
        return IP[1] * Math.exp(IP[2] / T) * P / (1 + IP[3] * Math.exp(IP[4] / T) * P) / (1 + IP[5] * Math.exp(IP[6] / T) * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

//? mutilayer bet

options = {
    label: "Langmuir 1 (Gas)",
    parameterCount: 2,
    guessInitialFunc: Langmuir.guessInitialFuncs.Langmuir,
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = IP_ini[2];
        IP[1] = IP[1] * IP[2];
    },
    Q: function (T, P, IP) {
        var mb = IP[1];
        var b = IP[2];

        return mb * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 2 (Gas)",
    parameterCount: 4,
    initModel: "Langmuir 1 (Gas)",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
    },
    Q: function (T, P, IP) {
        var mb0 = IP[1];
        var b1 = IP[2];
        var mb = mb0 * Math.exp(b1 / T);
        var b0_ = IP[3];
        var b1_ = IP[4];
        var b_ = b0_ * Math.exp(b1_ / T);

        return mb * P / (1 + b_ * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Langmuir 3 (Gas)",
    parameterCount: 4,
    initModel: "Langmuir 1 (Gas)",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1];
        IP[2] = 0;
        IP[3] = IP_ini[2];
        IP[4] = 0;
    },
    Q: function (T, P, IP) {
        var m0 = IP[1];
        var m1 = IP[2];
        var m = m0 - m1 * T;
        var b0 = IP[3];
        var b1 = IP[4];
        var b = b0 * Math.exp(b1 / T);

        return m * b * P / (1 + b * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Dual-Site Langmuir 1 (Gas)",
    parameterCount: 8,
    initModel: "Langmuir 2 (Gas)",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2];
        IP[3] = IP_ini[3] / 2;
        IP[4] = IP_ini[4];
        IP[5] = IP_ini[1] / 2;
        IP[6] = IP_ini[2];
        IP[7] = IP_ini[3] / 2;
        IP[8] = IP_ini[4];
    },
    Q: function (T, P, IP) {
        var m1b01 = IP[1];
        var b11 = IP[2];
        var m1b1 = m1b01 * Math.exp(b11 / T);
        var b01_ = IP[3];
        var b11_ = IP[4];
        var b1_ = b01_ * Math.exp(b11_ / T);
        var m2b02 = IP[5];
        var b12 = IP[6];
        var m2b2 = m2b02 * Math.exp(b12 / T);
        var b02_ = IP[7];
        var b12_ = IP[8];
        var b2_ = b02_ * Math.exp(b12_ / T);

        return m1b1 * P / (1 + b1_ * P) + m2b2 * P / (1 + b2_ * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

options = {
    label: "Dual-Site Langmuir 2 (Gas)",
    parameterCount: 8,
    initModel: "Langmuir 3",
    modifyInitialValueFunc: function (IP, IP_ini) {
        IP[1] = IP_ini[1] / 2;
        IP[2] = IP_ini[2] / 2;
        IP[3] = IP_ini[3] / 2;
        IP[4] = IP_ini[4];
        IP[5] = IP_ini[1] / 2;
        IP[6] = IP_ini[2] / 2;
        IP[7] = IP_ini[3] / 2;
        IP[8] = IP_ini[4];
    },
    Q: function (T, P, IP) {
        var m01 = IP[1];
        var m11 = IP[2];
        var m1 = m01 + m11 * T;
        var b01 = IP[3];
        var b11 = IP[4];
        var b1 = b01 * Math.exp(b11 / T);
        var m02 = IP[5];
        var m12 = IP[6];
        var m2 = m02 + m12 * T;
        var b02 = IP[7];
        var b12 = IP[8];
        var b2 = b02 * Math.exp(b12 / T);

        return m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P);
    }
};

Langmuir.models.push(new Langmuir.Model(options));

Langmuir.model = function (modelLabel) {
    for (var i = 0; i < Langmuir.models.length; i++) {
        if(Langmuir.models[i].label == modelLabel)
            return Langmuir.models[i];
    }

    return null;
};
