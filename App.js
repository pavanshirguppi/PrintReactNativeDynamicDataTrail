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
    let tableHTML_end = `</tbody></table>`;

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

    const reportData = [];
    reportData.push(
      `<tr style="text-align:center">
        <td>MY HEALTH SUMMARY</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>`,
    );

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
    </head>

    <body>
        <div style="width: 100%; text-align: center;">
            <h1 style="background-color: #2196f3; color: #fff; padding: 20px;">My Health Summary</h1>
            <h5 style="color: #2196f3;">State Nevada</h5>
            <hr style="border-top: 2px solid #2196f3;">
        </div>
        <h2 style="font-weight: bold;">Hi, John Allen <sup class="badge"
                style="font-weight: 300 !important;">${new Date()}</sup></h2>
                ${LabResults}
                ${VitalSigns}
                ${Immunizations}

        </table>
        <div style="text-align: right; margin-top: 25px; margin-right: 50px;">Doctor Signed</div>
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
