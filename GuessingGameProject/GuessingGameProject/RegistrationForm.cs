using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace GuessingGameProject
{
    public partial class RegistrationForm : Form
    {
        public static RegistrationForm objRegForm = new RegistrationForm();
        public RegistrationForm()
        {
            InitializeComponent();
        }

        private void submitButton_Click(object sender, EventArgs e)
        {
            try
            {

                if (File.Exists(nameTextBox.Text + ".txt"))
                {
                    MessageBox.Show("Name has been used by other user!!!");
                }
                else
                {
                    StreamWriter newUser = new StreamWriter(nameTextBox.Text + ".txt");
                    newUser.WriteLine(nameTextBox.Text);
                    newUser.WriteLine(passwordTextBox.Text);
                    newUser.Close();
                    MessageBox.Show("Create User successfully");
                    LoginForm.objLogin.Show();
                    nameTextBox.Clear();
                    passwordTextBox.Clear();
                    this.Hide();
                }


            }
            catch
            {
                MessageBox.Show("Create User unsuccessful");
            }
        }

        private void loginButton_Click(object sender, EventArgs e)
        {
            LoginForm.objLogin.Show();
            nameTextBox.Clear();
            passwordTextBox.Clear();
            this.Hide();
        }

      
    }
}
