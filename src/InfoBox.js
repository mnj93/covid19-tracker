import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css';
import { prettyPrintStat } from "./util";

function InfoBox({ title, activeStats, isRed, active, totalStats, ...props }) {
  return (
    <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`} onClick={props.onClick}>
      <CardContent>
        <Typography className="infoBox__title">
          {title}
        </Typography>
        <h1 className={`infoBox__activeStats ${!isRed && "infoBox__cases--green"}`}>{prettyPrintStat(activeStats)}</h1>
        <Typography className="infoBox__totalStats">
          {(totalStats)} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox;
