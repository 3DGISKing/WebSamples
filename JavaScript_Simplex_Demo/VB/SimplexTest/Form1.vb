Public Class Form1

    Public MaxIP As Integer = 12
    Public i, j, Ndata, NdataActive, IP_number, IsothermIndex As Integer
    Public T(), P(), Q() As Double
    Dim EstRound As Integer = 0
    Public IsothermType As String = "Unknown"
    Dim R1 As Double = 8.31451 'kJ/(kmol.K)
    Dim Tolerance As Double = 0.0000000001
    Dim StopButton As Boolean = False
    Dim chkInitialGuess As Boolean = True
    Dim chkSuccessive As Boolean = True
    Dim MaxIter As Integer = 100000
    Dim IP(8), IP_old(8) As Double

    Public Sub New()

        ' This call is required by the designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        cboModel.Items.Add("Langmuir (Temp)")
        cboModel.Items.Add("Two Site Langmuir (Temp)")
        cboModel.SelectedIndex = 0
        getData()

    End Sub

    Sub getData()
        IP_number = 8
        Ndata = 38
        NdataActive = Ndata
        ReDim T(Ndata), P(Ndata), Q(Ndata)
        T(1) = 343.15
        T(2) = 343.15
        T(3) = 343.15
        T(4) = 343.15
        T(5) = 343.15
        T(6) = 343.15
        T(7) = 343.15
        T(8) = 343.15
        T(9) = 343.15
        T(10) = 343.15
        T(11) = 343.15
        T(12) = 343.15
        T(13) = 343.15
        T(14) = 343.15
        T(15) = 357.85
        T(16) = 357.85
        T(17) = 357.85
        T(18) = 357.85
        T(19) = 357.85
        T(20) = 357.85
        T(21) = 357.85
        T(22) = 357.85
        T(23) = 357.85
        T(24) = 357.85
        T(25) = 357.85
        T(26) = 357.85
        T(27) = 372.65
        T(28) = 372.65
        T(29) = 372.65
        T(30) = 372.65
        T(31) = 372.65
        T(32) = 372.65
        T(33) = 372.65
        T(34) = 372.65
        T(35) = 372.65
        T(36) = 372.65
        T(37) = 372.65
        T(38) = 372.65

        P(1) = 0.0027399
        P(2) = 0.0039239
        P(3) = 0.0049119
        P(4) = 0.0057545
        P(5) = 0.0068732
        P(6) = 0.0083651
        P(7) = 0.0100251
        P(8) = 0.0118437
        P(9) = 0.013893
        P(10) = 0.0180662
        P(11) = 0.025146
        P(12) = 0.0368391
        P(13) = 0.0511987
        P(14) = 0.0676383
        P(15) = 0.0031359
        P(16) = 0.0042279
        P(17) = 0.0064212
        P(18) = 0.0092184
        P(19) = 0.0135063
        P(20) = 0.0192262
        P(21) = 0.0276526
        P(22) = 0.0363591
        P(23) = 0.0443456
        P(24) = 0.054212
        P(25) = 0.067705
        P(26) = 0.079678
        P(27) = 0.0025999
        P(28) = 0.0047079
        P(29) = 0.0074998
        P(30) = 0.0106971
        P(31) = 0.0148663
        P(32) = 0.0204795
        P(33) = 0.0265327
        P(34) = 0.0350791
        P(35) = 0.0454255
        P(36) = 0.0534653
        P(37) = 0.0636251
        P(38) = 0.0786914

        Q(1) = 0.00025943
        Q(2) = 0.00037073
        Q(3) = 0.00048208
        Q(4) = 0.0005923
        Q(5) = 0.00075091
        Q(6) = 0.00095503
        Q(7) = 0.00112974
        Q(8) = 0.001256
        Q(9) = 0.0013555
        Q(10) = 0.00147263
        Q(11) = 0.00158506
        Q(12) = 0.00168856
        Q(13) = 0.00177859
        Q(14) = 0.00185699
        Q(15) = 0.00017702
        Q(16) = 0.00022515
        Q(17) = 0.00033245
        Q(18) = 0.00049602
        Q(19) = 0.00078354
        Q(20) = 0.00110738
        Q(21) = 0.00132018
        Q(22) = 0.00146626
        Q(23) = 0.00154132
        Q(24) = 0.00161173
        Q(25) = 0.00168236
        Q(26) = 0.00173666
        Q(27) = 0.00010119
        Q(28) = 0.0001512
        Q(29) = 0.00022068
        Q(30) = 0.00030828
        Q(31) = 0.00043637
        Q(32) = 0.00063302
        Q(33) = 0.00084389
        Q(34) = 0.00107483
        Q(35) = 0.00124766
        Q(36) = 0.00134549
        Q(37) = 0.0014216
        Q(38) = 0.001514


    End Sub

    Private Sub cboModel_selected(sender As Object, e As EventArgs) Handles cboModel.SelectedIndexChanged
        IsothermType = cboModel.Text
    End Sub

    Private Sub btnRun_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnRun.Click

        Me.btnStop.Checked = False
        Me.btnRun.Enabled = False
        Me.btnStop.Enabled = True

        '
        ' Call Estimation_Main
        '
        Me.Estimation_Main()
        '
        ' If it has been interrupted
        '
        If StopButton = True Then
            StopButton = False
        End If

        Me.btnRun.Enabled = True
        Me.btnStop.Enabled = False

    End Sub

    Private Sub btnStop_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnStop.Click
        'response = MsgBox("Interrupt Estimation?", MsgBoxStyle.YesNo, "Mr.Langmuir")
        'If response = MsgBoxResult.Yes Then
        Application.DoEvents()
        StopButton = True
        Application.DoEvents()

        Me.btnRun.Enabled = True
        Me.btnStop.Checked = True

        Me.cboModel.Enabled = True
        Me.btnRun.Enabled = True
        Me.btnStop.Enabled = False

        'End If
    End Sub

    Sub SendTraceMsg(msg As String)
        ListBox_Message.Items.Add(msg)
        ListBox_Message.SelectedIndex = ListBox_Message.Items.Count - 1
    End Sub

    Private Sub Estimation_Main()
        Dim Ta(NdataActive), Pa(NdataActive), Qa(NdataActive) As Double
        Dim EstErr As Boolean = False
        '
        ' Initialization
        '
        EstRound = 0
        For i = 1 To IP_number
            IP_old(i) = 0
        Next

        Ta = T
        Pa = P
        Qa = Q

1:      EstRound = EstRound + 1
        Me.lblRound.Text = EstRound
        If EstRound > 200 Then
            EstErr = True
            SendTraceMsg("Warning: This estimation diverges....")
            GoTo 99
        End If
        If Me.cboLevel.Text = "Low" Then
            Application.DoEvents()
        End If

        '
        ' Estimation Begin
        '
        Me.Estimation_TwoSiteLangmuir_Temp(Ta, Pa, Qa, IP)
        '
        ' If Interrupted...
        '
        If StopButton = True Then
            Return
        End If

        chkInitialGuess = False

        '
        ' Successtive estimation?
        '
        If chkSuccessive Then
            Dim sum As Double
            sum = 0
            For i = 1 To IP_number
                sum = sum + ((IP(i) - IP_old(i)) / IP(i)) ^ 2
            Next
            If sum > 0.000001 Then
                For i = 1 To IP_number
                    IP_old(i) = IP(i)
                Next
                GoTo 1
            End If
        End If

        For i = 1 To IP_number
            SendTraceMsg("IP" & i & " = " & IP(i))
        Next

99:

    End Sub

    Private Sub InitialGuess_Langmuir(ByVal T() As Double, ByVal P() As Double, ByVal Q() As Double, ByRef IP() As Double)
        Dim a, b As Double
        Dim P_(NdataActive), Q_(NdataActive) As Double
        Dim noIP As Integer = 2
        '
        ' Data Conversion
        '
        For i = 1 To NdataActive
            P_(i) = 1 / P(i)
            Q_(i) = 1 / Q(i)
        Next
        '
        ' Call Least Square
        '
        LSTSQ(NdataActive, P_, Q_, a, b)
        '
        ' Results
        '
        IP(1) = 1 / b
        IP(2) = 1 / IP(1) / a
    End Sub

    Private Sub Estimation_Langmuir_Temp(ByVal T() As Double, ByVal P() As Double, ByVal Q() As Double, ByRef IP() As Double)
        Dim noIP As Integer = 4
        Dim IP_ini(noIP) As Double
        '
        ' Initial Guess
        '
        If chkInitialGuess = True Then
            Me.InitialGuess_Langmuir(T, P, Q, IP_ini)
            IP(1) = IP_ini(1)
            IP(2) = 0
            IP(3) = IP_ini(2)
            IP(4) = 0
        Else
            'For i = 1 To noIP
            '    IP(i) = 0 '
            'Next
        End If
        '
        ' Call Simplex 
        '
        Me.NMead(IsothermType, noIP, T, P, Q, IP)
        '
        ' Write results
        '
        'Me.UpdateChart_Prediction()
    End Sub

    Private Sub Estimation_TwoSiteLangmuir_Temp(ByVal T() As Double, ByVal P() As Double, ByVal Q() As Double, ByRef IP() As Double)
        Dim noIP As Integer = 8
        Dim IP_ini(noIP) As Double
        '
        ' Initial Guess
        '
        If chkInitialGuess = True Then
            Me.Estimation_Langmuir_Temp(T, P, Q, IP_ini)
            IP(1) = IP_ini(1) / 2
            IP(2) = IP_ini(2) / 2
            IP(3) = IP_ini(3) / 2
            IP(4) = IP_ini(4)
            IP(5) = IP_ini(1) / 2
            IP(6) = IP_ini(2) / 2
            IP(7) = IP_ini(3) / 2
            IP(8) = IP_ini(4)
        Else
            'For i = 1 To noIP
            '    IP(i) = Me.C1FlexGrid_IP(i, 2)
            'Next
        End If
        '
        ' Call Simplex 
        '
        Me.NMead(IsothermType, noIP, T, P, Q, IP)
        '
        ' Write results
        '
        'Me.UpdateChart_Prediction()
    End Sub


    Private Sub Estimation_IsothermModel(ByVal Isotherm As String, ByVal T As Double, ByVal P As Double, ByVal Q As Double, ByVal IP() As Double, ByRef Pcal As Double, ByRef Qcal As Double, ByRef Dev As Double, ByRef Del As Double)
        Dim m, b As Double
        Dim m1, b1, m2, b2, m3, b3 As Double
        Dim m01, m11, b01, b11, m02, m12, b02, b12, m03, m13, b03, b13 As Double

        Select Case Isotherm

            Case "Langmuir (Temp)"
                'If Me.chkTempQ.Checked = False Then
                '    IP(2) = 0
                'End If
                m = IP(1) + IP(2) * T
                b = IP(3) * Math.Exp(IP(4) / R1 / T)                  '  --> original form
                'b = IP(3) * Math.Exp(IP(4) / R1 * (1 / T - 1 / Tref))  '  --> best form for estimation
                Pcal = P
                Qcal = m * b * P / (1 + b * P)
                Del = (Q - Qcal) / Q
            Case "Two Site Langmuir (Temp)"
                m01 = IP(1)
                m11 = IP(2)
                b01 = IP(3)
                b11 = IP(4)
                m02 = IP(5)
                m12 = IP(6)
                b02 = IP(7)
                b12 = IP(8)
                m1 = m01 + m11 * T
                b1 = b01 * Math.Exp(b11 / R1 / T)
                'b1 = b01 * Math.Exp(b11 / R1 * (1 / T - 1 / Tref))
                m2 = m02 + m12 * T
                b2 = b02 * Math.Exp(b12 / R1 / T)
                'b2 = b02 * Math.Exp(b12 / R1 * (1 / T - 1 / Tref))
                Pcal = P
                Qcal = m1 * b1 * P / (1 + b1 * P) + m2 * b2 * P / (1 + b2 * P)
                Del = (Q - Qcal) / Q
            Case Else

        End Select
        Dev = Math.Abs(Del) * 100
    End Sub

    Sub NSolv(ByVal Isotherm As String, ByRef x() As Double, ByRef f As Double, ByVal noData As Integer, ByVal T() As Double, ByVal P() As Double, ByVal Q() As Double)
        Dim Pcal, Qcal, Dev, Del As Double
        f = 0
        For i = 1 To noData
            Me.Estimation_IsothermModel(Isotherm, T(i), P(i), Q(i), x, Pcal, Qcal, Dev, Del)
            f = f + Del * Del
        Next
        f = f / NdataActive
    End Sub

    Sub NMead(ByVal Isotherm As String, ByVal noIP As Integer, ByVal T() As Double, ByVal P() As Double, ByVal Q() As Double, ByRef a() As Double)
        Dim x(MaxIP + 4, MaxIP), f(MaxIP + 4) As Double
        Dim iter, n, i, ic, ic1, j, jm, k, kil, Icon, Index, np1, ny1, ny2, ny3, nc, noData As Integer
        nc = noIP
        noData = NdataActive
        Dim alpha, beta, gama, h, fxc As Double
        alpha = 1
        beta = 0.55
        gama = 2
        h = 0.00001 'System.Convert.ToDouble(Me.txtInitialSimplex.Text)
        n = nc
        j = 0
        Do
            j = j + 1
            x(1, j) = a(j)
        Loop Until (j = n)
        Icon = 0
        Index = 1
        np1 = n + 1
        ny1 = n + 2
        ny2 = n + 3
        ny3 = n + 4
        j = 1
        Do
            j = j + 1
            jm = j - 1
            k = 0
            Do
                k = k + 1
                x(j, k) = x(1, k)
                If (jm <> k) Then
                    GoTo 20
                End If
                If (x(j, k) = 0) Then
                    GoTo 19
                End If
                x(j, k) = x(j, k) * (1 + h)
                GoTo 20
19:             x(j, k) = h
20:         Loop Until (k = n)
        Loop Until (j = np1)

        Call Func(Isotherm, 1, np1, x, f, n, noData, T, P, Q)
        Call Order(x, f, n)

        iter = 0
201:    iter = iter + 1
        'Application.DoEvents()

        If Me.cboLevel.Text = "High" Then
            Me.lblIter.Text = iter
            Application.DoEvents()
        End If

        If (iter > MaxIter) Then
            fxc = 1.0E+99
            GoTo 999
        End If

        ' Interrupt estimation
        If Me.StopButton = True Then
            SendTraceMsg("Estimation has been interrupted...")
            Me.btnStop.Checked = False
            Return
        End If

        j = 0
        Do
            j = j + 1
            x(ny1, j) = 0
            i = 1
            Do
                i = i + 1
                x(ny1, j) = x(ny1, j) + x(i, j) / n
            Loop Until (i = np1)
            x(ny2, j) = x(ny1, j) * (1 + alpha) - alpha * x(1, j)
        Loop Until (j = n)
        Call Func(Isotherm, ny2, ny2, x, f, n, noData, T, P, Q)
        If (f(ny2) < f(np1)) Then
            GoTo 50
        End If
        ic1 = 1
        Do
            ic1 = ic1 + 1
            ic = n + 2 - ic1
            If (f(ny2) < f(ic)) Then
                GoTo 40
            End If
        Loop Until (ic1 = n)
        If (f(ny2) < f(1)) Then
            ' Interrupt estimation
            If Me.StopButton = True Then
                SendTraceMsg("Estimation has been interrupted...")
                Me.btnStop.Checked = False
                Return
            End If
            Call Insert(ny2, 1, x, f, n)
        End If
        j = 0
        Do
            j = j + 1
            x(ny3, j) = beta * x(1, j) + (1 - beta) * x(ny1, j)
        Loop Until (j = n)
        Call Func(Isotherm, ny3, ny3, x, f, n, noData, T, P, Q)
        If (f(ny3) < f(1)) Then
            GoTo 35
        End If
        k = 0
        Do
            k = k + 1
            j = 0
            Do
                j = j + 1
                x(k, j) = 0.5 * (x(k, j) + x(np1, j))
            Loop Until (j = n)
        Loop Until (k = n)
        Call Func(Isotherm, 1, n, x, f, n, noData, T, P, Q)
        Call Order(x, f, n)
        kil = 5
        GoTo 80
35:     ic1 = 1
        Do
            ic1 = ic1 + 1
            ic = np1 + 2 - ic1
            If (f(ny3) <= f(ic)) Then
                GoTo 37
            End If
        Loop Until (ic1 = np1)
        Call Insert(ny3, ic, x, f, n)
        GoTo 38
37:     Call Insert(ny3, ic, x, f, n)
38:     kil = 4
        GoTo 80
40:     Call Insert(ny2, ic, x, f, n)
        kil = 3
        GoTo 80
50:     j = 0
        Do
            j = j + 1
            x(ny3, j) = gama * x(ny2, j) + (1 - gama) * x(ny1, j)
        Loop Until (j = n)
        Call Func(Isotherm, ny3, ny3, x, f, n, noData, T, P, Q)

        If (f(ny3) < f(ny2)) Then
            GoTo 70
        End If
        Call Insert(ny2, np1, x, f, n)
        kil = 2
        GoTo 80
70:     Call Insert(ny3, np1, x, f, n)
        kil = 1
80:     Call ErrNM(kil, Index, x, f, n)
        If (Index = 1) Then
            GoTo 201
        End If
        Call Func(Isotherm, ny1, ny1, x, f, n, noData, T, P, Q)
        j = 0
        Do
            j = j + 1
            a(j) = x(np1, j)
        Loop Until (j = n)
        Call NSolv(Isotherm, a, fxc, noData, T, P, Q)
        SendTraceMsg(fxc)
999:    Index = Index
    End Sub

    Sub Insert(ByVal nhy As Integer, ByVal nlow As Integer, ByRef x(,) As Double, ByVal f() As Double, ByVal n As Integer)
        Dim i, j, k As Integer
        If (nlow = 1) Then
            GoTo 100
        End If
        i = 1
        Do
            i = i + 1
            j = i - 1
            f(j) = f(i)
            k = 0
            Do
                k = k + 1
                x(j, k) = x(i, k)
            Loop Until (k = n)
        Loop Until (i = nlow)
100:    f(nlow) = f(nhy)
        k = 0
        Do
            k = k + 1
            x(nlow, k) = x(nhy, k)
        Loop Until (k = n)
    End Sub

    Sub ErrNM(ByVal i As Integer, ByRef k As Integer, ByVal x(,) As Double, ByVal f() As Double, ByVal n As Integer)
        Dim np1, ii, jj As Integer
        np1 = n + 1
        If (k = 2) Then
            GoTo 70
        End If
        jj = 0
        Do
            jj = jj + 1
            ii = 0
            Do
                ii = ii + 1
                If (Math.Abs(1 - x(ii + 1, jj) / x(ii, jj)) < Tolerance) Then
                    GoTo 60
                End If
                GoTo 70
60:         Loop Until (ii = n)
        Loop Until (jj = n)
        k = 2
70:     k = k
    End Sub

    Sub Order(ByRef x(,) As Double, ByRef f() As Double, ByVal n As Integer)
        Dim xa(MaxIP), fd As Double
        Dim np1, j, k, jk, jm1, l As Integer
        np1 = n + 1
        j = 1
        Do
            j = j + 1
            jk = j - 1
            k = j - 1
            Do
                k = k + 1
                If (f(jk) > f(k)) Then
                    GoTo 18
                End If
                jk = k
18:         Loop Until (k = np1)
            jm1 = j - 1
            l = 0
            Do
                l = l + 1
                xa(l) = x(jm1, l)
                x(jm1, l) = x(jk, l)
                x(jk, l) = xa(l)
            Loop Until (l = n)
            fd = f(jm1)
            f(jm1) = f(jk)
            f(jk) = fd
        Loop Until (j = np1)
    End Sub

    Sub Func(ByVal Isotherm As String, ByVal init As Integer, ByVal iend As Integer, ByRef x(,) As Double, ByRef f() As Double, ByVal n As Integer, ByVal noDATA As Integer, ByVal T() As Double, ByVal P() As Double, ByVal Q() As Double)
        Dim ans(MaxIP) As Double
        Dim i, j As Integer
        i = init - 1
        Do
            i = i + 1
            j = 0
            Do
                j = j + 1
                ans(j) = x(i, j)
            Loop Until (j = n)
            Call NSolv(Isotherm, ans, f(i), noDATA, T, P, Q)
        Loop Until (i = iend)
    End Sub

    Sub LSTSQ(ByVal n As Integer, ByVal x() As Double, ByVal y() As Double, ByRef a As Double, ByRef b As Double)

        '---------------------------------------------------------------------------
        ' PURPOSE   : TO ESTIMATE PARAMETERS ( SLOPE & INTERCEPT )
        '             BY LEAST-SQURE METHOD
        '
        ' USAGE: Call LSTSQ(n, x, y, a, b)
        '
        ' ARGUMENTS : n - NUMBER OF DATA POINTS
        '             x - INDEPENDENT VARIABLE
        '             y - DEPENDENT VARIABLE
        '             a - slope
        '             b - intercept
        '
        ' OUTPUT    : a and b
        '---------------------------------------------------------------------------
        Dim term1, term2, term3, term4 As Double
        Dim i As Integer
        term1 = 0
        term2 = 0
        term3 = 0
        term4 = 0
        i = 0
        Do
            i = i + 1
            term1 = term1 + x(i) * y(i)
            term2 = term2 + x(i)
            term3 = term3 + y(i)
            term4 = term4 + x(i) * x(i)
        Loop Until (i = n)
        a = (n * term1 - term2 * term3) / (n * term4 - term2 * term2)
        b = (term4 * term3 - term1 * term2) / (n * term4 - term2 * term2)
    End Sub

End Class
