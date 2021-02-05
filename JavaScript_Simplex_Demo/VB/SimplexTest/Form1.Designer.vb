<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class Form1
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Dim resources As System.ComponentModel.ComponentResourceManager = New System.ComponentModel.ComponentResourceManager(GetType(Form1))
        Me.ToolStrip_Main = New System.Windows.Forms.ToolStrip()
        Me.cboModel = New System.Windows.Forms.ToolStripComboBox()
        Me.lblRunControl = New System.Windows.Forms.ToolStripLabel()
        Me.btnRun = New System.Windows.Forms.ToolStripButton()
        Me.btnStop = New System.Windows.Forms.ToolStripButton()
        Me.ToolStripSeparator9 = New System.Windows.Forms.ToolStripSeparator()
        Me.PrintLevel = New System.Windows.Forms.ToolStripLabel()
        Me.cboLevel = New System.Windows.Forms.ToolStripComboBox()
        Me.lblIter = New System.Windows.Forms.ToolStripLabel()
        Me.lblslash1 = New System.Windows.Forms.ToolStripLabel()
        Me.lblRound = New System.Windows.Forms.ToolStripLabel()
        Me.ListBox_Message = New System.Windows.Forms.ListBox()
        Me.ToolStrip_Main.SuspendLayout()
        Me.SuspendLayout()
        '
        'ToolStrip_Main
        '
        Me.ToolStrip_Main.GripStyle = System.Windows.Forms.ToolStripGripStyle.Hidden
        Me.ToolStrip_Main.Items.AddRange(New System.Windows.Forms.ToolStripItem() {Me.cboModel, Me.lblRunControl, Me.btnRun, Me.btnStop, Me.ToolStripSeparator9, Me.PrintLevel, Me.cboLevel, Me.lblIter, Me.lblslash1, Me.lblRound})
        Me.ToolStrip_Main.Location = New System.Drawing.Point(0, 0)
        Me.ToolStrip_Main.Name = "ToolStrip_Main"
        Me.ToolStrip_Main.RenderMode = System.Windows.Forms.ToolStripRenderMode.Professional
        Me.ToolStrip_Main.Size = New System.Drawing.Size(844, 25)
        Me.ToolStrip_Main.TabIndex = 1
        Me.ToolStrip_Main.Text = "ToolStrip2"
        '
        'cboModel
        '
        Me.cboModel.DropDownHeight = 250
        Me.cboModel.IntegralHeight = False
        Me.cboModel.Name = "cboModel"
        Me.cboModel.Size = New System.Drawing.Size(200, 25)
        '
        'lblRunControl
        '
        Me.lblRunControl.Name = "lblRunControl"
        Me.lblRunControl.Size = New System.Drawing.Size(71, 22)
        Me.lblRunControl.Text = "Run Control"
        '
        'btnRun
        '
        Me.btnRun.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.btnRun.Image = CType(resources.GetObject("btnRun.Image"), System.Drawing.Image)
        Me.btnRun.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.btnRun.Name = "btnRun"
        Me.btnRun.Size = New System.Drawing.Size(23, 22)
        Me.btnRun.Text = "Run"
        '
        'btnStop
        '
        Me.btnStop.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image
        Me.btnStop.Image = CType(resources.GetObject("btnStop.Image"), System.Drawing.Image)
        Me.btnStop.ImageTransparentColor = System.Drawing.Color.Magenta
        Me.btnStop.Name = "btnStop"
        Me.btnStop.Size = New System.Drawing.Size(23, 22)
        Me.btnStop.Text = "Interrupt"
        '
        'ToolStripSeparator9
        '
        Me.ToolStripSeparator9.Name = "ToolStripSeparator9"
        Me.ToolStripSeparator9.Size = New System.Drawing.Size(6, 25)
        '
        'PrintLevel
        '
        Me.PrintLevel.Name = "PrintLevel"
        Me.PrintLevel.Size = New System.Drawing.Size(94, 22)
        Me.PrintLevel.Text = "Communication"
        '
        'cboLevel
        '
        Me.cboLevel.AutoSize = False
        Me.cboLevel.BackColor = System.Drawing.SystemColors.ControlLightLight
        Me.cboLevel.DropDownHeight = 75
        Me.cboLevel.DropDownWidth = 50
        Me.cboLevel.IntegralHeight = False
        Me.cboLevel.Items.AddRange(New Object() {"High", "Low", "None"})
        Me.cboLevel.Name = "cboLevel"
        Me.cboLevel.Size = New System.Drawing.Size(50, 23)
        Me.cboLevel.Text = "Low"
        '
        'lblIter
        '
        Me.lblIter.Name = "lblIter"
        Me.lblIter.Size = New System.Drawing.Size(51, 22)
        Me.lblIter.Text = "Iteration"
        '
        'lblslash1
        '
        Me.lblslash1.Name = "lblslash1"
        Me.lblslash1.Size = New System.Drawing.Size(12, 22)
        Me.lblslash1.Text = "/"
        '
        'lblRound
        '
        Me.lblRound.Name = "lblRound"
        Me.lblRound.Size = New System.Drawing.Size(42, 22)
        Me.lblRound.Text = "Round"
        '
        'ListBox_Message
        '
        Me.ListBox_Message.Dock = System.Windows.Forms.DockStyle.Fill
        Me.ListBox_Message.FormattingEnabled = True
        Me.ListBox_Message.IntegralHeight = False
        Me.ListBox_Message.Location = New System.Drawing.Point(0, 25)
        Me.ListBox_Message.Name = "ListBox_Message"
        Me.ListBox_Message.ScrollAlwaysVisible = True
        Me.ListBox_Message.Size = New System.Drawing.Size(844, 425)
        Me.ListBox_Message.TabIndex = 6
        '
        'Form1
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(844, 450)
        Me.Controls.Add(Me.ListBox_Message)
        Me.Controls.Add(Me.ToolStrip_Main)
        Me.Name = "Form1"
        Me.Text = "Form1"
        Me.ToolStrip_Main.ResumeLayout(False)
        Me.ToolStrip_Main.PerformLayout()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents ToolStrip_Main As ToolStrip
    Friend WithEvents lblRunControl As ToolStripLabel
    Friend WithEvents btnRun As ToolStripButton
    Friend WithEvents btnStop As ToolStripButton
    Friend WithEvents ToolStripSeparator9 As ToolStripSeparator
    Friend WithEvents PrintLevel As ToolStripLabel
    Friend WithEvents cboLevel As ToolStripComboBox
    Friend WithEvents lblIter As ToolStripLabel
    Friend WithEvents lblslash1 As ToolStripLabel
    Friend WithEvents lblRound As ToolStripLabel
    Friend WithEvents cboModel As ToolStripComboBox
    Friend WithEvents ListBox_Message As ListBox
End Class
