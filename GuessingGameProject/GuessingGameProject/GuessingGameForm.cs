using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Speech;
using System.Speech.Synthesis;

namespace GuessingGameProject
{
    
    public partial class GuessingGameForm : Form
    {
        int intNumber = 0;
        bool blnStartFlag = false;
        int intNumberOfTries = 0;
        int intwin = 0;
        int intlose = 0;
        bool blnSuccess = false;
        public static GuessingGameForm objGuessing = new GuessingGameForm();
        SpeechSynthesizer read = new SpeechSynthesizer();
        public GuessingGameForm()
        {
            InitializeComponent();
        }

        private void startButton_Click(object sender, EventArgs e)
        {
            intNumber = GetNumber();
            blnStartFlag = true;
            intNumberOfTries = 0;
            blnSuccess = false;
            inputTextBox.Text = " ";
            messageLabel.Text = "The game has started now!";
            numTriesLabel.Text = "0";
            inputTextBox.Focus();
            File.WriteAllText(@"C:\appg\Jovenn Siow Pa11 APPPG mini projoct1 GuessingGameProject\game.txt", String.Empty);
            tryLabel.Text = "";
            submitButton.Enabled = true;
        }
        private int GetNumber()
        {
            double dblValue;
            Random ranObj = new Random();
            dblValue = ranObj.NextDouble();
            return ((int)(50 * dblValue));
        }
        private bool CheckValidInput(int intInput)
        {
            if ((intInput >= 0) && (intInput <= 100))
                return true;
            else
                return false;
        }
        private int CompareWithNumber(int intInput)
        {
            if (intInput == intNumber)
                return 0; // they are equal
            else if (intInput < intNumber)
                return -1; //input is lower
            else
                return 1;
        }

        private void exitButton_Click(object sender, EventArgs e)
        {
               
        }
        private void submitButton_Click(object sender, EventArgs e)
        {
            
        }

        private void submitButton_Click_1(object sender, EventArgs e)
        {
            StreamReader sr;
            int intTemp;
            int intStatus; //local variable to contain returned value

            if (blnStartFlag == false)
            { //true means startButton is clicked
                MessageBox.Show("Please click the Start button to start the game");
                return;
            }
            try
            {
                intTemp = int.Parse(inputTextBox.Text); //read data from inputTextBox
            }
            catch
            {//input data is not an integer!!!
                MessageBox.Show("Please enter your guessing number!");
                return;
            }

            if (CheckValidInput(intTemp) == false)
            { //invalid input?
                messageLabel.Text = "Invalid Input Number!!!";
            }
            else if(blnSuccess == true)
            {
                blnStartFlag = true;
                messageLabel.Text = "The Game is already ended.\n Click the Start button for another game!";
                read.Dispose();
                read = new SpeechSynthesizer();
                read.SpeakAsync(messageLabel.Text);
                submitButton.Enabled = false;
            }
            else if (intNumberOfTries >= 8)
            {
                blnStartFlag = true;
                messageLabel.Text = "The Game is already ended.\n Click the Start button for another game!";
                read.Dispose();
                read = new SpeechSynthesizer();
                read.SpeakAsync(messageLabel.Text);
                intlose = intlose + 1;
                loseLabel.Text = intlose.ToString();
                submitButton.Enabled = false;
            }
            else
            {
                intNumberOfTries++;
                numTriesLabel.Text = intNumberOfTries.ToString();
                intStatus = CompareWithNumber(intTemp);
                if (intStatus == 0)
                {
                    messageLabel.Text = "Congratulation! It's correct";
                    blnSuccess = true;
                    read.Dispose();
                    read = new SpeechSynthesizer();
                    read.SpeakAsync(messageLabel.Text);
                    intwin = intwin + 1;
                    winLabel.Text = intwin.ToString();

                }
                else if (intStatus == -1)
                    messageLabel.Text = "Too Low!!!";
                else
                    messageLabel.Text = "Too High!!!";

                StreamWriter sw = new StreamWriter(@"C:\appg\Jovenn Siow Pa11 APPPG mini projoct1 GuessingGameProject\game.txt", true);
                sw.WriteLine(inputTextBox.Text);
                sw.Close();
                sr = new StreamReader(@"C:\appg\Jovenn Siow Pa11 APPPG mini projoct1 GuessingGameProject\game.txt");
                tryLabel.Text = sr.ReadToEnd();
                sr.Close();

            }
        }

        private void exitButton_Click_1(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            objGuessing = this;
            this.Hide();
            LoginForm.objLogin.Show();
        }
    }
}

