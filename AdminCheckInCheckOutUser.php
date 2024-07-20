<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="userhome.css">
</head>
<body>
<?php

require_once "database.php";
if (isset($_POST["Back"])) {
    header("Location: Adminhome.php");
    exit();
}
class ParkingUserManager {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getParkingLocations($id = '', $firstname = '', $surname = '', $email = '') {
        // Start with a base SQL query
        $sql = "SELECT * FROM user WHERE 1=1"; // 1=1 is always true, serves as a starting point
        $params = [];
        $paramTypes = ''; // This will hold the types of the parameters
    
        if (!empty($id)) {
            $sql .= " AND id LIKE CONCAT('%', ?, '%')";
            $params[] = "%$id%";
            $paramTypes .= 's'; // 's' denotes string
        }
        if (!empty($firstname)) {
            $sql .= " AND firstname LIKE CONCAT('%', ?, '%')";
            $params[] = "%$firstname%";
            $paramTypes .= 's'; // 's' denotes string
        }
        if (!empty($surname)) {
            $sql .= " AND surname LIKE CONCAT('%', ?, '%')";
            $params[] = "%$surname%";
            $paramTypes .= 's'; // 's' denotes string
        }
        if (!empty($email)) {
            $sql .= " AND email LIKE CONCAT('%', ?, '%')";
            $params[] = "%$email%";
            $paramTypes .= 's'; // 's' denotes string
        }
    
        $stmt = $this->conn->prepare($sql);
    
        if (!empty($params)) {
            $stmt->bind_param($paramTypes, ...$params);
        }
    
        $stmt->execute();
        return $stmt->get_result();
    }

    public function renderSearchForm() {
        echo '<form name="search" action="AdminCheckInCheckOutUser.php" method="POST">
                <p><input type="text" name="id" value="" class="form-control" placeholder="id">
                <input type="text" name="firstname" value="" class="form-control" placeholder="firstname">
                <input type="text" name="surname" value="" class="form-control" placeholder="surname">
                <input type="text" name="email" value="" class="form-control" placeholder="email"></p>
                <input type="submit" name="Form" value="Submit" />
              </form>';
    }

    public function renderUserTable($qRes) {
        echo "<table width='100%' border='1'>\n";
        echo "<tr><th>ID</th><th>Types</th><th>Firstname</th>" .
             "<th>Surname</th><th>Phone Number</th><th>Email</th><th>Status</th></tr>\n";

        if ($qRes->num_rows > 0) {
            while (($Row = $qRes->fetch_row())) {
                    echo "<tr><td>{$Row[0]}</td>";
                    echo "<td>{$Row[1]}</td>";
                    echo "<td>{$Row[2]}</td>";
                    echo "<td>{$Row[3]}</td>";
                    echo "<td>{$Row[4]}</td>";
                    echo "<td>{$Row[5]}</td>";
                    if($Row[7] == 'Check-In')
                    {
                        echo "<td class='btn'><a href='Admincheckout.php?id={$Row[0]}' class='btn btn-primary'>Check-Out</a></td></tr>\n";
                    }
                    else
                    {
                        echo "<td class='btn'><a href='Adminsearchlocation.php?id={$Row[0]}' class='btn btn-primary'>Check-In</a></td></tr>\n";
                    }
            }
        } else {
            echo "<tr><td colspan='7'>No Record Found</td></tr>";
        }
        echo "</table>\n";
    }
}
// Usage example
try {
    $id = $firstname = $surname = $email = '';
    $parkingManager = new ParkingUserManager($conn);
    // If a search term has been posted, filter the parking locations
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'] ?? '';
        $firstname = $_POST['firstname'] ?? '';
        $surname = $_POST['surname'] ?? '';
        $email = $_POST['email'] ?? '';
    }
    $qRes = $parkingManager->getParkingLocations($id, $firstname, $surname, $email);

    $parkingManager->renderSearchForm();
    $parkingManager->renderUserTable($qRes);

} catch (mysqli_sql_exception $e) {
    die($e->getCode(). ": " . $e->getMessage());
} finally {
    $conn->close();
}
    
?>
</form>
</body>
<form action="AdminCheckInCheckOutUser.php" method="POST">
    <input type="submit" value="Back" name="Back" class="btn btn-primary">
</form>
</html>

