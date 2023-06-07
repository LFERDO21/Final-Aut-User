import { Button, Container, Typography, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endSession, getSession, isLoggedIn } from "../session";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Chart from "chart.js/auto"; // Importa Chart.js


// Configuración de tu segunda aplicación de Firebase
const secondFirebaseConfig = {
  apiKey: "AIzaSyADERCOuWMW8N9HDtfjuEXyAJhDnTspqlA",
  authDomain: "autenticator-admin.firebaseapp.com",
  projectId: "autenticator-admin",
  storageBucket: "autenticator-admin.appspot.com",
  messagingSenderId: "590827558242",
  appId: "1:590827558242:web:af6da7fd03a1dd2c9b883b",
  measurementId: "G-EHZ24KGYD8"
};
// Inicializa tu segunda aplicación de Firebase
const secondApp = initializeApp(secondFirebaseConfig, "secondApp");

export default function User() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [scores, setScores] = useState({});
  const [visualScore, setVisualScore] = useState(0);
  const [auditoryScore, setAuditoryScore] = useState(0);
  const [kinestheticScore, setKinestheticScore] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }

    let session = getSession();
    setEmail(session.email);

    console.log("Your access token is: " + session.accessToken);

    const getTests = async () => {
      try {
        const secondFirestore = getFirestore(secondApp);
        const testsCollection = collection(secondFirestore, "tests");
        const testsSnapshot = await getDocs(testsCollection);
        const testsData = testsSnapshot.docs.map((doc) => doc.data());
        setTests(testsData);
      } catch (error) {
        console.error(
          "Error al obtener la colección 'tests' de la segunda base de datos:",
          error
        );
      }
    };

    getTests();
  }, [navigate]);

  const onLogout = () => {
    endSession();
    navigate("/login");
  };

  const handleShowQuestions = (test) => {
    setSelectedTest(test);
    setOpenDialog(true);
    setScores({});
    setVisualScore(0);
    setAuditoryScore(0);
    setKinestheticScore(0);
    setIsTestFinished(false);
  };

  const handleCloseDialog = () => {
    setSelectedTest(null);
    setOpenDialog(false);
  };

  const handleScoreSelection = (questionIndex, scoreValue) => {
    setScores((prevScores) => ({
      ...prevScores,
      [questionIndex]: scoreValue,
    }));
    console.log("Selected score for question", questionIndex, ":", scoreValue);
  };

  const handleFinishTest = () => {
    let visual = 0;
    let auditory = 0;
    let kinesthetic = 0;

    selectedTest.questions.forEach((question, index) => {
      const score = scores[index];
      if (score) {
        if (question.type === "Visual") {
          visual += score;
        } else if (question.type === "Auditivo") {
          auditory += score;
        } else if (question.type === "Kinestésico") {
          kinesthetic += score;
        }
      }
    });

    setVisualScore(visual);
    setAuditoryScore(auditory);
    setKinestheticScore(kinesthetic);
    setIsTestFinished(true);
  };

  const handleViewResults = () => {
    // Aquí puedes realizar las acciones necesarias para mostrar los resultados de la encuesta
    console.log("Ver resultados de encuesta");
    const data = {
      labels: ["Visual", "Auditivo", "Kinestésico"],
      datasets: [
        {
          label: "Scores",
          data: [visualScore, auditoryScore, kinestheticScore],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    const options = {
      responsive: true,
    };

    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: data,
      options: options,
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Typography variant="h6" component="h1" textAlign="center" gutterBottom>
        Al fin te has logueado:
      </Typography>
      <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
        {email}
      </Typography>
      <Typography variant="p" component="p" textAlign="center" gutterBottom>
        Revisar (access/session) token.
      </Typography>
      <Grid container spacing={2}>
        {tests.map((test, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Psychologist: {test.psychologist}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Test Name: {test.testName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Created At: {test.createdAt}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleShowQuestions(test)}
                  sx={{ mt: 2 }}
                >
                  Show Questions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="error"
        onClick={onLogout}
        sx={{ mt: 3 }}
        fullWidth
      >
        Log out
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Questions</DialogTitle>
        <DialogContent>
          {selectedTest && (
            <div>
              <Typography variant="h6" gutterBottom>
                Psychologist: {selectedTest.psychologist}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Test Name: {selectedTest.testName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Created At: {selectedTest.createdAt}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Questions:
              </Typography>
              <Typography>Seleccione Individualmente</Typography>
              <Typography>
                Casi siempre: 5 Frecuentemente: 4 A veces: 3 Rara vez: 2 Casi nunca: 1
              </Typography>
              <ul>
                {selectedTest.questions.map((question, index) => (
                  <li key={index}>
                    {question.text}
                    <div>
                      {[1, 2, 3, 4, 5].map((scoreValue) => (
                        <button
                          key={scoreValue}
                          onClick={() => handleScoreSelection(index, scoreValue)}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            backgroundColor:
                              scores[index] === scoreValue ? "green" : "gray",
                            margin: "5px",
                          }}
                          disabled={isTestFinished} // Deshabilitar el botón cuando el test haya finalizado
                        >
                          {scoreValue}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleFinishTest} color="primary" disabled={isTestFinished}>
            Finish Test
          </Button>
        </DialogActions>
      </Dialog>

      {isTestFinished && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewResults}
          sx={{ mt: 3 }}
          fullWidth
        >
          Ver resultado de encuesta
        </Button>
      )}

      {isTestFinished && (
        <div>
          <canvas id="chart" width="400" height="400"></canvas>
        </div>
      )}

      {visualScore > 0 && (
        <Typography variant="h6" component="h2" textAlign="center" gutterBottom>
          Visual Score: {visualScore}
        </Typography>
      )}
      {auditoryScore > 0 && (
        <Typography variant="h6" component="h2" textAlign="center" gutterBottom>
          Auditory Score: {auditoryScore}
        </Typography>
      )}
      {kinestheticScore > 0 && (
        <Typography variant="h6" component="h2" textAlign="center" gutterBottom>
          Kinesthetic Score: {kinestheticScore}
        </Typography>
      )}
    </Container>
  );
}