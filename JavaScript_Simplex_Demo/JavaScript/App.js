theApp = (function () {
    var startButton = $("#start");
    var stopButton = $("#stop");
    var outputPara = $("#output");
    var iterationLabel = $("#iteration");

    function init(){
        startButton.click(function () {
                  /*
            IsothermType = "Langmuir (Temp)";

            getData();
            main();
            */



            // var IsothermType = $('#IsothermType option:selected').val();
            //
            // var w;
            //
            // if(typeof(Worker) !== "undefined") {
            //     if(typeof(w) == "undefined") {
            //         w = new Worker("Engine.js?IsothermType=" + IsothermType);
            //     }
            //
            //     w.onmessage = function(event) {
            //         var data = event.data;
            //
            //         if(data.type == "iteration"){
            //             setIteration(data.data);
            //         }
            //         else if (data.type == "message") {
            //             sendTraceMsg(data.data);
            //         }
            //     };
            // } else {
            //     alert("Sorry, your browser does not support Web Workers...");
            // }

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

            var index = $('#IsothermType option:selected').val();

            var model = Langmuir.models[index];

            console.info("***" + model.label + "***");


            var IP = model.estimate(T, P, Q, true);

            console.log(IP);

            //model = Langmuir.model("Langmuir-Freundlich");

            //console.log(model.errorFuncValue(T, P, Q, [0.00286907033385231, 23.179, 1.04]));
        });

        stopButton.click(function () {
            console.log("stop");
        });

        var models = Langmuir.models;

        for (var i = 0; i < models.length; i++) {
            var model = models[i];

            $('#IsothermType').append($('<option>', {
                value: i,
                text : model.label
            }));

        }
    }

    function sendTraceMsg(s) {
        if(outputPara.html().trim() != "")
            outputPara.html(outputPara.html() + '<br>' + s);
        else
            outputPara.html(s);
    }

    function setIteration(i) {
        iterationLabel.text("iteration / " + i);
    }

    return {
        init: init,
        sendTraceMsg: sendTraceMsg,
        setIteration: setIteration
    }
})();