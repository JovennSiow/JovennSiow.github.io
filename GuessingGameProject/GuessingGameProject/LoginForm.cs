using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace GuessingGameProject
{
    public partial class LoginForm : Form
    {
        public static string strName;
        public static LoginForm objLogin = new LoginForm();
        
        public LoginForm()
        {
            InitializeComponent();
        }

        private void LoginButton_Click(object sender, EventArgs e)
        {
            try
            {
                string strpassword;

                if ((nameTextBox.Text == "") || (passwordTextBox.Text == ""))
                    MessageBox.Show("Please enter your user ID and Password");
                else
                {
                    StreamReader newUserReader = new StreamReader(nameTextBox.Text + ".txt");
                    strName = newUserReader.ReadLine();
                    strpassword = newUserReader.ReadLine();
                    if (strpassword == passwordTextBox.Text)
                    {
                        MessageBox.Show("Login successful");
                        objLogin = this;
                        this.Hide();
                        GuessingGameForm.objGuessing.Show();
                        nameTextBox.Clear();
                        passwordTextBox.Clear();
                    }

                    else
                        MessageBox.Show("Login fail");
                }
            }
            catch
            {
                MessageBox.Show("User not found");
            }
        }

        private void QuitButton_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void RegistrationButton_Click(object sender, EventArgs e)
        {
            objLogin = this;
            //this.Hide();
            RegistrationForm.objRegForm.Show();
        }

        private void LoginForm_Load(object sender, EventArgs e)
        {
            timer1.Start();
            DateLabel.Text = DateTime.Now.ToLongDateString();
            timeLabel.Text = DateTime.Now.ToLongTimeString();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            timeLabel.Text = DateTime.Now.ToLongTimeString();
            timer1.Start();
        }
    }
}
