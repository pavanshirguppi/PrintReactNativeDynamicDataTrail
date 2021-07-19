// Print HTML as a Document from React Native App for Android and iOS
// https://aboutreact.com/react-native-print-html/

// Import React
import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

// Import HTML to PDF
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Import RNPrint
import RNPrint from 'react-native-print';

// import moment from 'moment';
import Data from './data';

const App = () => {
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  // Only for iOS
  const selectPrinter = async () => {
    const selectedPrinter = await RNPrint.selectPrinter({x: 100, y: 100});
    setSelectedPrinter(selectedPrinter);
  };

  // Only for iOS
  const silentPrint = async () => {
    if (!selectedPrinter) {
      alert('Must Select Printer First');
    }
    const jobName = await RNPrint.print({
      printerURL: selectedPrinter.url,
      html: '<h1>Silent Print clicked</h1>',
    });
  };

  const generateHTML = () => {
    let tableHTML_start = `<table cell-padding="5" style="width: 100%">
    <thead>
        <tr style="text-align: center; background-color: #2196f3; color: #fff;">
            <td class="white">Test Name</td>
            <td class="white">Result</td>
            <td class="white">Reference</td>
            <td class="white">Interpretation</td>
        </tr>
    </thead>
    <tbody>`;
    let tableHTML_end = '</tbody></table>';

    const im_table_start = `<table cell-padding="5" style="width: 100%">
    <thead>
        <tr style="text-align: center; background-color: #2196f3; color: #fff;">
            <td class="white">Date</td>
            <td class="white">Vaccine</td>
            <td class="white">Details</td>
        </tr>
    </thead>
    <tbody>`;

    let LabResults = [];
    Data.LabResults.map((lbr, index) => {
      let lbr_html = `<tr style="text-align:center">
      <td>${lbr.TestName} on ${lbr.Date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      })}</td>
      <td>${lbr.Result}</td>
      <td>${lbr.RangeLowValue}-${lbr.RangeHighValue} ${lbr.RangeHighUnit}</td>
      <td>${lbr.Interpretation}</td>
    </tr>`;
      if (index === 0) {
        LabResults.push(tableHTML_start);
      }

      LabResults.push(lbr_html);

      if (index === Data.LabResults.length) {
        LabResults.push(tableHTML_end);
      }
    });

    let VitalSigns = [];
    Data.VitalSigns.map((vts, index) => {
      let vts_html = `<tr style="text-align:center">
      <td>${vts.TestName} on ${vts.Date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      })}</td>
      <td>${vts.Result}</td>
      <td>${vts.RangeLowValue}-${vts.RangeHighValue} ${vts.RangeHighUnit}</td>
      <td>${vts.Interpretation}</td>
    </tr>`;

      if (index === 0) {
        VitalSigns.push(tableHTML_start);
      }

      VitalSigns.push(vts_html);

      if (index === Data.VitalSigns.length) {
        VitalSigns.push(tableHTML_end);
      }
    });

    let Immunizations = [];
    Data.Immunizations.map((imm, index) => {
      let imm_html = `<tr style="text-align:center">
      <td>${imm.Date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      })}</td>
      <td>${imm.vaccine}</td>
      <td>${imm.doseQuantity ? `Qty:${imm.doseQuantity},` : ''}
          ${imm.doseNumber ? ` Dose#:${imm.doseNumber},` : ''}
          ${imm.LotNumber ? ` Lot#:${imm.LotNumber}` : ''}
      </td>
    </tr>`;

      if (index === 0) {
        Immunizations.push(im_table_start);
      }

      Immunizations.push(imm_html);

      if (index === Data.Immunizations.length) {
        Immunizations.push(tableHTML_end);
      }
    });

    let Prescriptions = [];
    Data.Prescriptions.map((presc, index) => {
      let presc_html = `
          <div
            class="container"
            style={"border-bottom-width: (${index} === ${
        presc.length
      } - ${1} ? ${0} : ${1});"}
          >
            <div class="rowStyle">
              <div class="labelValuePair">
                <p class="labels">Drug Name</p>`;

      Prescriptions.push(presc_html);

      presc.DrugName.map(drug => {
        let presc_html2 = `<p class="values">${drug.DrugName}</p>`;

        Prescriptions.push(presc_html2);
      });

      let presc_html3 = `</div>
                        </div>
                        <div class="rowStyle">
                          <div class="labelValuePairRow">
                            <p class="labels">DAYS_SUPPLY</p>
                            <p class="values">${
                              presc.DaysSupply ? presc.DaysSupply : ''
                            }</p>
                          </div>
                          <div class="labelValuePairRow">
                            <p class="RightLabels">REFILL</p>
                            <p class="values">${
                              presc.Refill ? presc.Refill : ''
                            }</p>
                          </div>
                        </div>
                        <div class="rowStyle">
                          <div class="labelValuePairRow">
                            <p class="labels">DATE</p>
                            <p class="values">
                              ${presc.Date ? presc.Date : ''}
                            </p>
                          </div>
                        </div>
                        </div>`;
      Prescriptions.push(presc_html3);
    });

    let ProvidersSeen = [];
    Data.ProvidersSeen.map((proSeen, index) => {
      let pds_html = `<div class="container" style={"border-bottom-width: (${index} === ${
        proSeen.length
      } - ${1} ? ${0} : ${1});"}>
              <div class="rowStyle">
              <div class="labelValuePair">
                <p class="labels">PROVIDER</p><p class="values">${
                  proSeen.Provider.Name === null ? '' : proSeen.Provider.Name
                }</p>
              </div>
              <div class="RightLabelValuePair">
              <p class="RightLabels">Date</p>
              <p class="values">${proSeen.Date ? proSeen.Date : ''}</p>
              </div>
              </div>
              <div class="rowStyle">
                <div class="labelValuePair">
                  <p class="labels">PROVIDER_SPECIALTY</p>
                  <p class="values">
                    ${
                      proSeen.Provider.Speciality === null
                        ? ''
                        : proSeen.Provider.Speciality
                    }
                  </p>
                </div>
              </div>
              <div class="rowStyle">
                <div class="labelValuePair">
                  <p class="labels">PHONE</p>
                  <p class="values">
                    ${
                      proSeen.Provider.Phone === null
                        ? ''
                        : proSeen.Provider.Phone
                    }
                  </p>
                </div>
              </div>
            </div>`;

      ProvidersSeen.push(pds_html);
    });

    let Claims = [];
    Data.Claims.map((claim, index) => {
      let claim_html = `<div>
      <div class="claim_container">
      <div class="claim_rowStyle">
        <div class="claim_leftLabelValuePair">
          <p class="claim_labels">LABEL_CLAIM_NO</p>
          <p class="claim_values">${claim.ClaimNo}</p>
        </div>
        <div class="claim_RightLabelValuePair">
          <p class="claim_RightLabels">LABEL_SUBMITTED_ON</p>
          <p class="claim_values">${claim.SubmissionDate}</p>
        </div>
      </div>
      <div class="claim_columnStyle">
        <p class="claim_labels">BILLABLE_PERIOD</p>
        <div class="claim_rowStyle1">
          <div class="claim_leftLabelValuePair1">
            <p class="claim_labels">LABEL_START</p>
            <p class="claim_values">${claim.BillablePeriod.Start}</p>
          </div>
          <div class="claim_RightLabelValuePair1">
            <p class="claim_RightLabels">LABEL_END</p>
            <p class="claim_values">${claim.BillablePeriod.End}</p>
          </div>
        </div>
      </div>

      <div class="claim_columnStyle">
        <div class="claim_leftLabelValuePair">
          <p class="claim_labels">LABEL_PROVIDER</p>
          <p class="claim_values">
            ${claim.Provider.Name === null ? '' : claim.Provider.Name}
            <span class="claim_subValues">${
              claim.Provider.ProviderID === null
                ? ''
                : -claim.Provider.ProviderID
            }</span>
          </p>
        </div>
      </div>
      <div class="claim_columnStyle">
        <div class="claim_leftLabelValuePair">
          <p class="claim_labels">MEMBER</p>
          <p class="claim_values">
            ${claim.MemberFirstName} ${claim.MemberLastName}
            <span class="claim_subValues"> - ${claim.MemberId}</span>
          </p>
        </div>
      </div>
      <div class"columnStyle">
        <div class="claim_leftLabelValuePair">
          <p class="claim_labels">DIAGNOSIS</p>`;

      Claims.push(claim_html);

      claim.DiagnosisCode.map(Diagn => {
        let claim_html2 = `<p class="claim_values">
            ${Diagn.Diagnosis}
          </p>`;

        Claims.push(claim_html2);
      });

      let claim_html3 = `</div>
      </div>
      <div class="claim_rowStyle">
        <div class="claim_leftLabelValuePair">
          <p class="claim_labels">LABEL_STATUS</p>
          <p class="claim_values">${claim.Status}</p>
        </div>
        <div class="claim_RightLabelValuePair">
          <p class="claim_labels">LABEL_BILL_DATE</p>
          <p class="claim_values">${claim.BillDate}</p>
        </div>
      </div>
      <div class="claim_columnStyle">
        <div class="claim_leftLabelValuePair1">
          <p class="claim_labels">LABEL_TOTAL_BILLED_AMOUNT</p>
          <p class="claim_values">${claim.TotalBilledAmount}</p>
        </div>
        <div class="claim_leftLabelValuePair1">
          <p class="claim_labels">{labelName(Constant.LABEL_TOTAL_ALLOWED_AMOUNT)}</p>
          <p class="claim_values">${claim.TotalAllowedAmount}</p>
        </div>
        <div class="claim_leftLabelValuePair1">
          <p class="claim_labels">LABEL_TOTAL_PAID_AMOUNT</p>
          <p class="claim_values">${claim.TotalPaidAmount}</p>
        </div>
        <div class="claim_leftLabelValuePair1">
          <p class="claim_labels">LABEL_TOTAL_PATIENT_AMOUNT</p>
          <p class="claim_values">${claim.TotalPatientAmount}</p>
        </div>
      </div>
      <p class="claim_value">LABEL_SERVICE_LINE_DETAILS</p>`;

      Claims.push(claim_html3);

      claim.ServiceLines.map((SL, index) => {
        let claim_html4 = `${SL.ServiceName}

        <div class="claim_ContentTextWrap">
          <div class="claim_columnStyle">
            <div class="claim_leftLabelValuePair1">
              <p class="claim_labels">
                LABEL_BILLED_AMOUNT
              </p>
              <p class="claim_values">${SL.BilledAmount}</p>
            </div>
            <div class="claim_leftLabelValuePair1">
              <p class="claim_labels">
                LABEL_ALLOWED_AMOUNT
              </p>
              <p class="claim_values">${SL.AllowedAmount}</p>
            </div>
            <div class="claim_leftLabelValuePair1">
              <p class="claim_labels">
                LABEL_PAID_AMOUNT
              </p>
              <p class="claim_values">${SL.PaidAmount}</p>
            </div>
            <div class="claim_leftLabelValuePair1">
              <p class="claim_labels">
                LABEL_PATIENT_AMOUNT
              </p>
              <p class="claim_values">${SL.PatientAmount}</p>
            </div>
          </div>

          <div class="claim_rowStyle">
            <div class="claim_leftLabelValuePair">
              <p class="claim_labels">
               LABEL_MY_BENEFITS_START_DATE
              </p>
              <p class="claim_values">${SL.StartDate}</p>
            </div>
            <div class="claim_RightLabelValuePair">
              <p class="claim_RightLabels">
                LABEL_MY_BENEFITS_END_DATE
              </p>
              <p class="claim_values">${SL.EndDate}</p>
            </div>
          </div>
        </div></div>`;

        Claims.push(claim_html4);
      });
    });

    return `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
            body {
                font-family: calibri;
            }

            table,
            tr,
            td {
                border: 1px solid #2196f3;
                border-collapse: collapse;
            }

            .page_break {
                page-break-before: always;
            }

            .badge {
                display: inline-block;
                padding: 0.25em 0.4em;
                font-size: 72%;
                font-weight: 300;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
                border-radius: 0.25rem;
                transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }

            .badge-pill {
                padding-right: 0.6em;
                padding-left: 0.6em;
                border-radius: 10rem;
            }

            .badge-info {
                color: #fff;
                background-color: #2196f3;
            }

            .white {
                border-color: #fff !important;
            }
            </style>

            <style>
            .rowStyle {
              display: flex;
              flexDirection: row;
              justify-content: space-between;
              margin-bottom: 8;
            }

            .labelValuePairRow { display: flex; flex-direction: row; align-items: center; }

            .labels {
              font-size: 13;
              color: #7a7a7a;
              margin: 0;
              padding: 0;
              padding-right: 5;
            }

            .values {
              font-size: 15;
              color: #3a3a3a;
              margin: 0;
              padding: 0;
            }
            
            .labelValuePair { display: flex; flex-direction: column; }

            .RightLabels {
              display: flex;
              margin: 0;
              margin-right: 10;
              padding: 0;
              font-size: 13;
              color: #3a3a3a;
              align-items: flex-end;
            }

            .container {
              border-bottom-color: #9a9a9a;
              border-bottom-style: solid;
              border-bottom-width: 1;
              margin-bottom: 15;
            }
        </style>
        <style>
        
        .claim_container {
          border-bottom-color: #cccccc;
          border-bottom-width: 1;
          margin-top: 10;
        }
        .claim_rowStyle {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 8;
          padding-bottom: 8;
          border-bottom: 1px solid #dddddd;
        }
        .claim_rowStyle1 {
          display: flex;
          flex-direction: 'row;
          justify-content: 'space-between;
          margin-top: 5,
        }
        .claim_columnStyle {
          display: flex;
          margin-bottom: 8;
          flex-direction: column;
          border-bottom: 1px solid #dddddd;
          padding-bottom: 8;
        }
        .claim_leftLabelValuePair {
          display: flex;
          flex-direction: column;
        },
        .claim_leftLabelValuePair1 {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-end;
        },
        .claim_RightLabelValuePair: { display: flex; flexDirection: column; align-items: flex-end; },
        .claim_RightLabelValuePair1: { display: flex; flexDirection: row; align-items: flex-end; },
        
        .claim_rowLabelValuePair {
          display: flex;
          margin-bottom: 8;
          flex-direction: row;
          align-items: flex-end;
        }

        .claim_labels {
          margin: 0;
          font-size: 12;
          color: #7a7a7a;
          padding-right: 5;
          display: inline-block;
        },

        .claim_RightLabels: {
          margin: 0;
          font-size: 11;
          color: #7a7a7a;
          align-items: flex-end;
          display: inline-block;
        }

        .claim_values {
          margin: 0;
          font-size: 14;
          color: #3a3a3a;
          display: inline-block;
        }

        .claim_subValues {
          margin: 0;
          font-size: 12;
          margin-top: -3;
          color: #3a3a3a;
          display: inline-block;
        }

        .claim_root {
          background-color: transparent;
          margin: 0;
          padding: 0;
          color: #ffffff;
          box-shadow: none;
        }
        
        .claim_myPanel {
          text-align: left;
          padding: 0;
          margin: 0 0 3px 0;
          box-shadow: none;
          background-color: transparent;
        }

        .claim_SummaryText2 {
          font-size: 14;
          color: #3a3a3a;
          text-transform: Capital-case;
        }

        .claim_iconColor {
          color: #3e82c4;
        }

        .claim_ContentTextWrap {
          display: flex;
          flex-direction: column;
          color: #000000;
          padding: 0;
          padding-bottom: 0;
        }

        </style>
    </head>

    <body>
        <div style="width: 100%; text-align: center;">
            <h1 style="background-color: #2196f3; color: #fff; padding: 20px;">My Health Summary</h1>
            <h5 style="color: #2196f3;">State Nevada</h5>
            <hr style="border-top: 2px solid #2196f3;">
        </div>
        <h2 style="font-weight: bold;">Hi, John Allen <sup class="badge"
                style="font-weight: 300 !important;">${new Date()}</sup></h2>
                
                ${Claims.join('')}
                ${Prescriptions.join('')}
                ${ProvidersSeen.join('')}
                ${Immunizations.join('')}
                ${LabResults.join('')}
                ${VitalSigns.join('')}
    </body>
    </html>`;
  };

  const printHTML = async () => {
    await RNPrint.print({
      // html: '<h1>Here will be Heading 1</h1><br><h2>Here will be Heading 2</h2><br><h3>Here will be Heading 3</h3><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1>',
      html: generateHTML(),
    });
  };

  const printPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      // html: '<h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1><h1>Demo Text to converted to PDF</h1>',
      html: generateHTML(),
      fileName: 'test',
      base64: true,
    });
    await RNPrint.print({filePath: results.filePath});
  };

  const printRemotePDF = async () => {
    await RNPrint.print({
      filePath: 'http://www.africau.edu/images/default/sample.pdf',
    });
  };

  const customOptions = () => {
    return (
      <View>
        {selectedPrinter && (
          <View>
            <Text>{`Selected Printer Name: ${selectedPrinter.name}`}</Text>
            <Text>{`Selected Printer URI: ${selectedPrinter.url}`}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.buttonStyle} onPress={selectPrinter}>
          <Text>Click to Select Printer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={silentPrint}>
          <Text>Click for Silent Print</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Print HTML as a Document from React Native App
      </Text>
      <View style={styles.container}>
        {Platform.OS === 'ios' && customOptions()}
        <TouchableOpacity style={styles.buttonStyle} onPress={printHTML}>
          <Text>Click to Print HTML</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={printPDF}>
          <Text>Click to Print PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={printRemotePDF}>
          <Text>Click to Print Remote PDF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginVertical: 10,
  },
});
