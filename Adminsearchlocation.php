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
    class ParkingLocationManager
    {
        private $conn;

        public function __construct($conn)
        {
            $this->conn = $conn;
        }

        public function getParkingLocations($id = '', $location = '', $description = '') {
            // Start with a base SQL query
            $sql = "SELECT * FROM parkinglocation WHERE 1=1"; // 1=1 is always true, serves as a starting point
            $params = [];
            $paramTypes = ''; // This will hold the types of the parameters
        
            if (!empty($id)) {
                $sql .= " AND ParkingID LIKE CONCAT('%', ?, '%')";
                $params[] = "%$id%";
                $paramTypes .= 's'; // 's' denotes string
            }
            if (!empty($location)) {
                $sql .= " AND Location LIKE CONCAT('%', ?, '%')";
                $params[] = "%$location%";
                $paramTypes .= 's'; // 's' denotes string
            }
            if (!empty($description)) {
                $sql .= " AND Description LIKE CONCAT('%', ?, '%')";
                $params[] = "%$description%";
                $paramTypes .= 's'; // 's' denotes string
            }
        
            $stmt = $this->conn->prepare($sql);
        
            if (!empty($params)) {
                $stmt->bind_param($paramTypes, ...$params);
            }
        
            $stmt->execute();
            return $stmt->get_result();
        }

        public function renderSearchForm()
        {
            echo '<form name="search" action="Adminsearchlocation.php" method="POST">
                <p><input type="text" name="id" value="" class="form-control" placeholder="id">
                <input type="text" name="Location" value="" class="form-control" placeholder="Location">
                <input type="text" name="Description" value="" class="form-control" placeholder="Description"></p>
                <input type="submit" name="Form" value="Submit" />
              </form>';
        }

        public function renderParkingLocationsTable($qRes)
        {
            echo "<table width='100%' border='1'>\n";
            echo "<tr><th>ParkingID</th><th>Location</th><th>Description</th>" .
                "<th>Parking Spaces</th><th>Cost Per Hour</th><th>Cost For Late</th><th>Check-In</th></tr>\n";

            if ($qRes->num_rows > 0) {
                while (($Row = $qRes->fetch_row())) {
                    if ($Row[3] > 0) {
                        echo "<tr><td>{$Row[0]}</td>";
                        echo "<td>{$Row[1]}</td>";
                        echo "<td>{$Row[2]}</td>";
                        echo "<td>{$Row[3]}</td>";
                        echo "<td>{$Row[4]}</td>";
                        echo "<td>{$Row[5]}</td>";
                        echo "<td class='btn'><a href='Admincheckinduration.php?id={$Row[0]}' class='btn btn-primary'>Check-in</a></td></tr>\n";
                    }
                }
            } else {
                echo "<tr><td colspan='7'>No Record Found</td></tr>";
            }
            echo "</table>\n";
        }

        public function getUser()
        {
            $iduser = $_GET['id'] ;
            $sql = "SELECT * FROM user WHERE id = ?";
            $stmt = mysqli_prepare($this->conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $iduser);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $user = mysqli_fetch_array($result, MYSQLI_ASSOC);
            $_SESSION["userid"] = $iduser;
            $_SESSION["user"] = $user['firstname'] . $user['surname'];
            $_SESSION["email"] = $user['email'];
            $_SESSION["firstname"] = $user['firstname'];
            $_SESSION["surname"] = $user['surname'];
            $_SESSION["phone"] = $user['phone'];
        }
    }

    // Usage example
    try {
        session_start();
        
        
        $iduser = $locations = $descriptions = '';
        $parkingManager = new ParkingLocationManager($conn);
        if (isset($_GET['id'])) {
            $parkingManager->getUser();
        }
        //echo $_GET['id'];
        // If a search term has been posted, filter the parking locations
        $id = $location = $description = '';
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'] ?? '';
            $location = $_POST['Location'] ?? '';
            $description = $_POST['Description'] ?? '';
        }
        $qRes = $parkingManager->getParkingLocations($id, $location, $description);
        
        $parkingManager->renderSearchForm();
        $parkingManager->renderParkingLocationsTable($qRes);
        
    } catch (mysqli_sql_exception $e) {
        die($e->getCode() . ": " . $e->getMessage());
    } finally {
        $conn->close();
    }

    ?>
    </form>
</body>

</html>