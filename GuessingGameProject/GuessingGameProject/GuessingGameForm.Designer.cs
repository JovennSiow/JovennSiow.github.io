namespace GuessingGameProject
{
    partial class GuessingGameForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.startButton = new System.Windows.Forms.Button();
            this.messageLabel = new System.Windows.Forms.Label();
            this.inputTextBox = new System.Windows.Forms.TextBox();
            this.submitButton = new System.Windows.Forms.Button();
            this.numTriesLabel = new System.Windows.Forms.Label();
            this.exitButton = new System.Windows.Forms.Button();
            this.tryLabel = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.outButton = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.winLabel = new System.Windows.Forms.Label();
            this.loseLabel = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.BackColor = System.Drawing.Color.Blue;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 19.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            this.label1.Location = new System.Drawing.Point(60, 36);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(556, 53);
            this.label1.TabIndex = 1;
            this.label1.Text = "Number Guessing Game(0-100)";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.BackColor = System.Drawing.Color.Blue;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 19.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            this.label2.Location = new System.Drawing.Point(275, 104);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(298, 38);
            this.label2.TabIndex = 2;
            this.label2.Text = "(Max. 8 tries/game)";
            // 
            // startButton
            // 
            this.startButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.startButton.Location = new System.Drawing.Point(694, 36);
            this.startButton.Name = "startButton";
            this.startButton.Size = new System.Drawing.Size(94, 53);
            this.startButton.TabIndex = 3;
            this.startButton.Text = "Start";
            this.startButton.UseVisualStyleBackColor = true;
            this.startButton.Click += new System.EventHandler(this.startButton_Click);
            // 
            // messageLabel
            // 
            this.messageLabel.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.messageLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.messageLabel.Location = new System.Drawing.Point(60, 267);
            this.messageLabel.Name = "messageLabel";
            this.messageLabel.Size = new System.Drawing.Size(142, 118);
            this.messageLabel.TabIndex = 14;
            // 
            // inputTextBox
            // 
            this.inputTextBox.Location = new System.Drawing.Point(273, 182);
            this.inputTextBox.Multiline = true;
            this.inputTextBox.Name = "inputTextBox";
            this.inputTextBox.Size = new System.Drawing.Size(124, 39);
            this.inputTextBox.TabIndex = 13;
            // 
            // submitButton
            // 
            this.submitButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.submitButton.Location = new System.Drawing.Point(403, 182);
            this.submitButton.Name = "submitButton";
            this.submitButton.Size = new System.Drawing.Size(114, 39);
            this.submitButton.TabIndex = 12;
            this.submitButton.Text = "Submit";
            this.submitButton.UseVisualStyleBackColor = true;
            this.submitButton.Click += new System.EventHandler(this.submitButton_Click_1);
            // 
            // numTriesLabel
            // 
            this.numTriesLabel.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.numTriesLabel.Location = new System.Drawing.Point(633, 142);
            this.numTriesLabel.Name = "numTriesLabel";
            this.numTriesLabel.Size = new System.Drawing.Size(100, 32);
            this.numTriesLabel.TabIndex = 11;
            // 
            // exitButton
            // 
            this.exitButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.exitButton.Location = new System.Drawing.Point(541, 385);
            this.exitButton.Name = "exitButton";
            this.exitButton.Size = new System.Drawing.Size(94, 53);
            this.exitButton.TabIndex = 10;
            this.exitButton.Text = "Exit";
            this.exitButton.UseVisualStyleBackColor = true;
            this.exitButton.Click += new System.EventHandler(this.exitButton_Click_1);
            // 
            // tryLabel
            // 
            this.tryLabel.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.tryLabel.Location = new System.Drawing.Point(273, 257);
            this.tryLabel.Name = "tryLabel";
            this.tryLabel.Size = new System.Drawing.Size(153, 184);
            this.tryLabel.TabIndex = 16;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(278, 237);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(148, 20);
            this.label3.TabIndex = 15;
            this.label3.Text = "No. That You Tried";
            // 
            // outButton
            // 
            this.outButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.outButton.Location = new System.Drawing.Point(664, 387);
            this.outButton.Name = "outButton";
            this.outButton.Size = new System.Drawing.Size(124, 51);
            this.outButton.TabIndex = 17;
            this.outButton.Text = "sign out";
            this.outButton.UseVisualStyleBackColor = true;
            this.outButton.Click += new System.EventHandler(this.button1_Click);
            // 
            // label4
            // 
            this.label4.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(639, 117);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(119, 25);
            this.label4.TabIndex = 18;
            this.label4.Text = "No. of tries";
            // 
            // label5
            // 
            this.label5.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(618, 193);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(155, 25);
            this.label5.TabIndex = 19;
            this.label5.Text = "No. of times win";
            // 
            // winLabel
            // 
            this.winLabel.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.winLabel.Location = new System.Drawing.Point(633, 218);
            this.winLabel.Name = "winLabel";
            this.winLabel.Size = new System.Drawing.Size(100, 32);
            this.winLabel.TabIndex = 20;
            // 
            // loseLabel
            // 
            this.loseLabel.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.loseLabel.Location = new System.Drawing.Point(633, 326);
            this.loseLabel.Name = "loseLabel";
            this.loseLabel.Size = new System.Drawing.Size(100, 31);
            this.loseLabel.TabIndex = 21;
            // 
            // label7
            // 
            this.label7.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.Location = new System.Drawing.Point(605, 301);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(168, 25);
            this.label7.TabIndex = 22;
            this.label7.Text = "No. of times lose";
            // 
            // GuessingGameForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.loseLabel);
            this.Controls.Add(this.winLabel);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.outButton);
            this.Controls.Add(this.tryLabel);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.messageLabel);
            this.Controls.Add(this.inputTextBox);
            this.Controls.Add(this.submitButton);
            this.Controls.Add(this.numTriesLabel);
            this.Controls.Add(this.exitButton);
            this.Controls.Add(this.startButton);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Name = "GuessingGameForm";
            this.Text = "GuessingGameForm";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button startButton;
        private System.Windows.Forms.Label messageLabel;
        private System.Windows.Forms.TextBox inputTextBox;
        private System.Windows.Forms.Button submitButton;
        private System.Windows.Forms.Label numTriesLabel;
        private System.Windows.Forms.Button exitButton;
        private System.Windows.Forms.Label tryLabel;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button outButton;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label winLabel;
        private System.Windows.Forms.Label loseLabel;
        private System.Windows.Forms.Label label7;
    }
}