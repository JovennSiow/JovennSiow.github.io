<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="userhome.css">
</head>
<body>
<?php

require_once "database.php";
class ParkingUserManager {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getParkingUser($tableName) {
            return $this->conn->query("SELECT * FROM $tableName");
    }

    public function renderSearchForm() {
        echo '<form name="search" action="Adminparkinginform.php" method="POST">
                <input type="text" name="search" value="" class="form-control" placeholder="Search">
                <input type="submit" name="Form" value="Submit" />
              </form>';
    }

    public function renderUserTable($qRes) {
        echo "<table width='100%' border='1'>\n";
        echo "<tr><th>ID</th><th>Firstname</th><th>Surname</th>" .
             "<th>Email</th><th>Phone</th></tr>\n";

        if ($qRes->num_rows > 0) {
            while (($Row = $qRes->fetch_row())) {
                    echo "<tr><td>{$Row[0]}</td>";
                    echo "<td>{$Row[1]}</td>";
                    echo "<td>{$Row[2]}</td>";
                    echo "<td>{$Row[3]}</td>";
                    echo "<td>{$Row[4]}</td>";
            }
        } else {
            echo "<tr><td colspan='7'>No Record Found</td></tr>";
        }
        echo "</table>\n";
    }

}

// Usage example
try {
    session_start();
    $parkingManager = new ParkingUserManager($conn);
    $location = $_GET['location'] ?? '';
    $tableName = preg_replace('/[^a-zA-Z0-9_]/', '', strtolower(str_replace(' ', '_', $location)));
    $qRes = $parkingManager->getParkingUser($tableName);
    $parkingManager->renderUserTable($qRes);

} catch (mysqli_sql_exception $e) {
    die($e->getCode(). ": " . $e->getMessage());
} finally {
    $conn->close();
}

?>
</form>
</body>
</html>

