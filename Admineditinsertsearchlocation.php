<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="userhome.css">
    <style>
        .large-dropdown {
            font-size: 1.5em;
        }
    </style>
</head>
<body>
<?php

require_once "database.php";
if (isset($_POST["Back"])) {
    header("Location: Adminhome.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST["Insert"])) {
        header("Location: AdmininsertLocation.php");
        exit();
    }
}
class ParkingLocationManager {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getParkingLocations($id = '', $location = '', $description = '', $type = 'all') {
        // Start with a base SQL query
        $sql = "SELECT * FROM parkinglocation WHERE 1=1"; // 1=1 is always true, serves as a starting point
        $params = [];
        $types = '';
    
        // Add conditions based on each specific filter, if provided
        if (!empty($id)) {
            $sql .= " AND ParkingID LIKE CONCAT('%', ?, '%')";
            $params[] = $id;
            $types .= 's';
        }
        if (!empty($location)) {
            $sql .= " AND Location LIKE CONCAT('%', ?, '%')";
            $params[] = $location;
            $types .= 's';
        }
        if (!empty($description)) {
            $sql .= " AND Description LIKE CONCAT('%', ?, '%')";
            $params[] = $description;
            $types .= 's';
        }
    
        // Add conditions based on parking availability
        if ($type == 'Fullparking') {
            $sql .= " AND ParkingSpaces <= 0";
        } elseif ($type == 'Availableparking') {
            $sql .= " AND ParkingSpaces > 0";
        }
    
        // Prepare and execute the SQL query with parameters
        $stmt = $this->conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        return $stmt->get_result();
    }

    public function renderSearchForm() {
        echo '<form name="search" action="Admineditinsertsearchlocation.php" method="POST">
                <p><input type="text" name="id" value="" class="form-control" placeholder="id">
                <input type="text" name="Location" value="" class="form-control" placeholder="Location">
                <input type="text" name="Description" value="" class="form-control" placeholder="Description"></p>
                <select class="large-dropdown" name="type">
                    <option value="all">all</option>
                    <option value="Fullparking">Full Parking</option>
                    <option value="Availableparking">Available Parking</option>
                </select>
                <input type="submit" name="Form" value="Submit" />
              </form>';
    }

    public function renderParkingLocationsTable($qRes) {
        echo "<table width='100%' border='1'>\n";
        echo "<tr><th>ParkingID</th><th>Location</th><th>Description</th>" .
             "<th>Parking Spaces</th><th>Cost Per Hour</th><th>Cost For Late</th><th>Check-In</th></tr>\n";

        if ($qRes->num_rows > 0) {
            while (($Row = $qRes->fetch_row())) {
                echo "<tr><td>{$Row[0]}</td>";
                echo "<td>{$Row[1]}</td>";
                echo "<td>{$Row[2]}</td>";
                echo "<td>{$Row[3]}</td>";
                echo "<td>{$Row[4]}</td>";
                echo "<td>{$Row[5]}</td>";
                echo "<td class='btn'><a href='AdmineditLocation.php?id={$Row[0]}&Location={$Row[1]}&Description={$Row[2]}&ParkingSpaces={$Row[3]}& 
                CostPerHour={$Row[4]}& CostForLate={$Row[5]}' class='btn btn-primary'>Edit</a></td></tr>\n";
            }
        } else {
            echo "<tr><td colspan='7'>No Record Found</td></tr>";
        }
        echo "</table>\n";
    }
}

// Usage example
try {
    $id = $location = $description = '';
    $parkingManager = new ParkingLocationManager($conn);
    $type = 'all';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'] ?? '';
        $location = $_POST['Location'] ?? '';
        $description = $_POST['Description'] ?? '';
        $type = $_POST['type'] ?? 'all'; // This line retrieves the type from POST data
    }
    $qRes = $parkingManager->getParkingLocations($id, $location, $description, $type);
    $parkingManager->renderSearchForm();
    $parkingManager->renderParkingLocationsTable($qRes);

} catch (mysqli_sql_exception $e) {
    die($e->getCode(). ": " . $e->getMessage());
} finally {
    $conn->close();
}

?>

<form action="Admineditinsertsearchlocation.php" method="post">
        <input type="submit" value="Insert parking locations" name="Insert" class="btn btn-primary">
        <input type="submit" value="Back" name="Back" class="btn btn-primary">
</form>
</body>
</html>

