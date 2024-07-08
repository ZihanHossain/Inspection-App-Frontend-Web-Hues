import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/AddUser.css";
import HeaderBar from "./HeaderBar";
import NavPanel from "./NavPanel";

const Reports = () => {
  const [eId, setEID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Reports";
    if (localStorage.getItem("token") == null) {
      navigate("/");
    } else {
      if (!localStorage.getItem("permissions").includes("reports")) {
        return navigate("/access-denied");
      }
    }
  }, []);

  return (
    <div className="card-container">
      <HeaderBar title="Reports" module="fabric" />
      <div className="bottom-section">
        <NavPanel />
        <div className="bottom-right-section">
          <div className="report-section">
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2f4_point_inspection_report_By+Batch&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        4 Point Inspection Report By Batch
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2f4_point_inspection_report_By+Roll&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        4 Point Inspection Report By Roll
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fMachine_wise_report&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Machine Wise Report
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fGSM+Report&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        GSM Report
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fRoll-wise+Final+Inspection+Report+Without+Excess&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Roll-wise Final Inspection Report Without Excess
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fRoll-wise+Final+Inspection+Report+With+Excess&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Roll-wise Final Inspection Report With Excess
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fShade+Approval+Card&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Shade Approval Card
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fShade+Band&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Shade Band
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fShade+Classification&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Shade Classification
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
            <div className="report-card">
              <Link to="http://administrator:masterpass@10.12.3.182/ReportServer/Pages/ReportViewer.aspx?%2fInspector_Performance&rs:Command=Render">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://1.bp.blogspot.com/-nzm908Pfunw/VqXgeRNp4LI/AAAAAAAACJI/wgeVntLSIT8/w1200-h630-p-k-no-nu/status-report.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h8" component="div">
                        Inspector Performance
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
