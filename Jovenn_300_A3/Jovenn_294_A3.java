//Jovenn Siow
//Full Time
//Class number: 294
//I will be demoing 1 and it is my own work(never pass to anyone)

import javax.swing.JFrame;
import javax.swing.JButton;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JOptionPane;
import javax.swing.JLabel;
import javax.swing.UIManager;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import java.util.*;

class PersonInfo {
    protected String name;
    protected String title;
    protected String imageFile;


    public PersonInfo(String name, String title, String imageFile )
    {
        this.name = name;
        this.title = title;
        this.imageFile = imageFile;
    }

    public PersonInfo(PersonInfo pi)
    {
        this(pi.name, pi.title, pi.imageFile);
    }

    public String getName()
    {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getImageFile() {
        return imageFile;
    }



    public void setInfo(String name, String title, String imageFile )
    {
        this.name = name;
        this.title = title;
        this.imageFile = imageFile;
    }

    @Override
    public String toString()
    {
        return String.format("%s%n %s",name,title);
    }
}

class Student extends PersonInfo
{
    private String group;
    private String demoWhat;

    public Student(String name, String title, String imageFile, String group, String demoWhat)
    {
        super(name, title, imageFile);
        this.group = group;
        this.demoWhat = demoWhat;
    }

    public String getGroup() {
        return group;
    }

    public String getDemoWhat() {
        return demoWhat;
    }

    public void setInfo(String name, String title, String imageFile, String group, String demoWhat) {
        super.setInfo(name, title, imageFile);
        this.group = group;
        this.demoWhat = demoWhat;
    }

    @Override
    public String toString() {
        return String.format("Hi Sir, I am %s%n I am from %s%n I wish to demo %s",super.toString(),group,demoWhat);
    }
}

class Lecturer extends PersonInfo
{
    private ArrayList<String> message;

    public Lecturer(String name, String title, String imageFile, ArrayList<String> message)
    {
        super(name, title, imageFile);
        this.message = message;
    }

    public Lecturer(Lecturer lect)
    {
        this(lect.name, lect.title, lect.imageFile, lect.message);
    }

    public ArrayList<String> getMessage() {
        return message;
    }

    public void setInfo(String name, String title, String imageFile, ArrayList<String> message) {
        super.setInfo(name, title, imageFile);
        this.message = message;
    }

    @Override
    public String toString() {
        return String.format("My suggestions, if any: %n");
    }
}


class Start extends JFrame implements ActionListener
{
    private final JButton button1;
    private final JLabel label;

    public Start()
    {
        super("Let us start");
        setLayout(new FlowLayout());

        ImageIcon ic = new ImageIcon("welcome1.gif");
        label = new JLabel("CSIT121 Demo System");
        label.setIcon(ic);

        button1 = new JButton("Ok");

        add(label);
        add(button1);
        button1.addActionListener(this);
    }

    @Override
    public void actionPerformed(ActionEvent e)
    {
        if(e.getSource() == button1)
        {
            Start st = new Start();
            st.setVisible(false);
            Next nx = new Next();
            nx.setSize(200, 300);
            nx.setVisible(true);
            nx.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        }

    }

}

class Next extends JFrame implements ActionListener
{
    private final JLabel label;
    private final JLabel label1;
    private final JLabel label2;

    private int c = -1;
    private final JButton button;

    ArrayList<Integer> count = new ArrayList<>(Arrays.asList(0,1,2));

    public Next()
    {
        super("Welcome to 121 Demo System");
        setLayout(new FlowLayout());

        ImageIcon sim = new ImageIcon("sim.jpg");
        Image image = sim.getImage(); // transform it
        Image newimg = image.getScaledInstance(300, 120,  java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
        sim = new ImageIcon(newimg);
        label = new JLabel();
        label.setIcon(sim);

        ImageIcon clab = new ImageIcon("clab.gif");
        Image image1 = clab.getImage(); // transform it
        Image newimg1 = image1.getScaledInstance(60, 60,  java.awt.Image.SCALE_DEFAULT); // scale it the smooth way
        clab = new ImageIcon(newimg1);
        label1 = new JLabel();
        label1.setIcon(clab);

        ImageIcon rabbit = new ImageIcon("rabbit.gif");
        Image image2 = rabbit.getImage(); // transform it
        Image newimg2 = image2.getScaledInstance(60, 60,  java.awt.Image.SCALE_DEFAULT); // scale it the smooth way
        rabbit = new ImageIcon(newimg2);
        label2 = new JLabel();
        label2.setIcon(rabbit);

        button = new JButton("Refresh button to get the next student");
        add(label);

        add(button);
        button.addActionListener(this);
        Collections.shuffle(count);

        add(label2);
        add(label1);
    }

    @Override
    public void actionPerformed(ActionEvent e)
    {
        c = c + 1;
        UIManager.put("OptionPane.background", Color.yellow);
        UIManager.put("OptionPane.messageForeground", Color.BLUE);
		UIManager.put("Panel.background", Color.yellow);

        Random rn = new Random();
        int number = rn.nextInt(5);
        ArrayList<String> message = new ArrayList<>(Arrays.asList("-Statements too long", "-Use meaningful identifiers",
                "-Overall design OK", "-Well done", "-Some improvements needed"));

        try {
            if (e.getSource() == button && count.get(c) == 0) {
                Collections.shuffle(message);
                ArrayList<String> finalm = new ArrayList<>();
                for (int i = 0; i <= number; i++) {
                    finalm.add(message.get(i));
                }
                Student sd = new Student("Jovenn", "Part Time Student", "1.jpg", "T03", "Assignment 3");
                Lecturer lc = new Lecturer("Heng", "Lecturer", "heng.jpg", finalm);

                ImageIcon bean = new ImageIcon(sd.imageFile);
                Image image = bean.getImage(); // transform it
                Image newimg = image.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                bean = new ImageIcon(newimg);

                JOptionPane.showMessageDialog(null, sd, "Let us welcome " + sd.name, JOptionPane.INFORMATION_MESSAGE, bean);

                ImageIcon beanlect = new ImageIcon(lc.imageFile);
                Image image1 = beanlect.getImage(); // transform it
                Image newimg1 = image1.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                beanlect = new ImageIcon(newimg1);

                String tstr = "";
                for (int i = 0; i < finalm.size(); i++) {
                    if (Objects.equals(finalm.get(i), "-Well done")) {
                        tstr = "-Well done\n";
                        break;
                    } else {
                        String str = finalm.get(i) + "\n";
                        tstr = tstr + str;
                    }
                }

                JOptionPane.showMessageDialog(null, lc + tstr + "\n" + lc.name + "\n" + lc.title, "Hi " + sd.name +
                        ", my comment to your " + sd.getDemoWhat(), JOptionPane.INFORMATION_MESSAGE, beanlect);

            } else if (e.getSource() == button && count.get(c) == 1) {
                Collections.shuffle(message);
                ArrayList<String> finalm = new ArrayList<>();
                for (int i = 0; i <= number; i++) {
                    finalm.add(message.get(i));
                }
                Student sd = new Student("Bob", "Part Time Student", "2.jpg", "T03", "Lab 3");
                Lecturer lc = new Lecturer("Heng", "Lecturer", "heng.jpg", finalm);

                ImageIcon ash = new ImageIcon(sd.imageFile);
                Image image = ash.getImage(); // transform it
                Image newimg = image.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                ash = new ImageIcon(newimg);

                JOptionPane.showMessageDialog(null, sd, "Let us welcome " + sd.name, JOptionPane.INFORMATION_MESSAGE, ash);

                ImageIcon bean = new ImageIcon(lc.imageFile);
                Image image1 = bean.getImage(); // transform it
                Image newimg1 = image1.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                bean = new ImageIcon(newimg1);

                String tstr = "";
                for (int i = 0; i < finalm.size(); i++) {
                    if (Objects.equals(finalm.get(i), "-Well done")) {
                        tstr = "-Well done\n";
                        break;
                    } else {
                        String str = finalm.get(i) + "\n";
                        tstr = tstr + str;
                    }
                }

                JOptionPane.showMessageDialog(null, lc + tstr + "\n" + lc.name + "\n" + lc.title, "Hi " + sd.name +
                        ", my comment to your " + sd.getDemoWhat(), JOptionPane.INFORMATION_MESSAGE, bean);
            } else if (e.getSource() == button && count.get(c) == 2) {
                Collections.shuffle(message);
                ArrayList<String> finalm = new ArrayList<>();
                for (int i = 0; i <= number; i++) {
                    finalm.add(message.get(i));
                }
                Student sd = new Student("Poke", "Part Time Student", "3.jpg", "T03", "Lab 3");
                Lecturer lc = new Lecturer("Heng", "Lecturer", "heng.jpg", finalm);

                ImageIcon cat = new ImageIcon(sd.imageFile);
                Image image = cat.getImage(); // transform it
                Image newimg = image.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                cat = new ImageIcon(newimg);

                JOptionPane.showMessageDialog(null, sd, "Let us welcome " + sd.name, JOptionPane.INFORMATION_MESSAGE, cat);

                ImageIcon ash = new ImageIcon(lc.imageFile);
                Image image1 = ash.getImage(); // transform it
                Image newimg1 = image1.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                ash = new ImageIcon(newimg1);

                String tstr = "";
                for (int i = 0; i < finalm.size(); i++) {
                    if (Objects.equals(finalm.get(i), "-Well done")) {
                        tstr = "-Well done\n";
                        break;
                    } else {
                        String str = finalm.get(i) + "\n";
                        tstr = tstr + str;
                    }
                }

                JOptionPane.showMessageDialog(null, lc + tstr + "\n" + lc.name + "\n" + lc.title, "Hi " + sd.name +
                        ", my comment to your " + sd.getDemoWhat(), JOptionPane.INFORMATION_MESSAGE, ash);
            }
        }
            catch (IndexOutOfBoundsException e1)
            {
                ImageIcon sim = new ImageIcon("sim.jpg");
                Image image = sim.getImage(); // transform it
                Image newimg = image.getScaledInstance(100, 100, java.awt.Image.SCALE_SMOOTH); // scale it the smooth way
                sim = new ImageIcon(newimg);

                JOptionPane.showMessageDialog(null, "No more student\n Hope you enjoy my system","Thank you", JOptionPane.INFORMATION_MESSAGE, sim);

            }
        }
}




class Jovenn_294_A3
{

    public static void main (String [] args)
    {

        Start st = new Start();
        st.setSize(200, 300);
        st.setVisible(true);
        st.getContentPane().setBackground(Color.YELLOW);
        st.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

    }

}