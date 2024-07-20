<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php
class CheckInDuration{
    private $conn;
    public function __construct($conn) {
        $this->conn = $conn;
        session_start();
    }

    public function setSessionIdnlocation() {
        if (isset($_GET['id'])) {
            $_SESSION['id'] = $_GET['id'];
        }
        $sql = "SELECT * FROM parkinglocation WHERE ParkingID = ?";
        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $_SESSION['id']);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $parking = mysqli_fetch_array($result, MYSQLI_ASSOC);
        $parkingname = preg_replace('/[^a-zA-Z0-9_]/', '', str_replace(' ', '_', $parking["Location"]));
        $_SESSION["parkingname"] = $parkingname;
    }

    public function processCheckIn($post, $parkingname) {
        if (isset($post['submit'])) {
            $checkInDate = $post['date'];
            $checkInTime = $post['time'];
            $duration = intval($post['duration']);
            $_SESSION['duration'] = $duration;
            $dateTimeString = $checkInDate . ' ' . $checkInTime;
            $checkInDateTime = new DateTime($dateTimeString);
            $startTime = $checkInDateTime->format('Y-m-d H:i');
            $_SESSION['starttime'] = $startTime;
            $checkInDateTime->modify("+$duration hours");

            $endTime = $checkInDateTime->format('Y-m-d H:i');
            $_SESSION['datetime'] = $endTime;
            $sql = "UPDATE parkinglocation SET ParkingSpaces=ParkingSpaces-1 WHERE ParkingID = ?";
            $stmt = mysqli_prepare($this->conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $_SESSION['id']);
            mysqli_stmt_execute($stmt);

            $sql = "UPDATE user SET status='Check-In' WHERE id = ?";
            $stmt = mysqli_prepare($this->conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $_SESSION['userid']);
            mysqli_stmt_execute($stmt);

            $sql = "UPDATE user SET Location=? WHERE email = ?";
            $stmt = mysqli_prepare($this->conn, $sql);
            mysqli_stmt_bind_param($stmt, "ss", $parkingname, $_SESSION['email']);
            mysqli_stmt_execute($stmt);

            $sql = "INSERT INTO $parkingname (firstname, surname, email, phone) VALUES (?, ?, ?, ?)";
            $stmt = mysqli_prepare($this->conn, $sql);
            mysqli_stmt_bind_param($stmt, "ssss", $_SESSION['firstname'],$_SESSION['surname'],$_SESSION['email'],$_SESSION['phone']);
            mysqli_stmt_execute($stmt);

            echo $_SESSION['userid'];
            header("Location: AdminCheckInCheckOutUser.php");
            exit();
        }
    }

    public function getFormattedCheckInTime($dateTimeString, $duration) {
        return "Check-in time: " . htmlspecialchars($dateTimeString) . "<br>" .
               "Expected end time after $duration hour(s): " . htmlspecialchars($_SESSION['datetime']);
    }
}
require_once "database.php";
$CheckInDuration = new CheckInDuration($conn);
$CheckInDuration->setSessionIdnlocation();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $CheckInDuration->processCheckIn($_POST, $_SESSION["parkingname"]);
}
?>
    <div class="container">
    <h1>Check-In Form</Form></h1><br>
    <form action="Admincheckinduration.php" method="post">
        <div class="form-group">
            <input type="date" placeholder="Enter Date:" name="date" class="form-control">
        </div>
        <div class="form-group">
            <input type="time" placeholder="Enter time:" name="time" class="form-control">
        </div>
        <div class="form-group">
            <input type="number" placeholder="Enter intended duration of use(in hours):" name="duration" class="form-control">
        </div>
        <div class="form-group">
            <input type="submit" value="Check-in" name="submit" class="btn btn-primary">
        </div>
    </form>
    </div>
</body>
</html>