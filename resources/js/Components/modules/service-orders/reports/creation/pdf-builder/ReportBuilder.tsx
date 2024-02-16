import * as React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, pdf } from '@react-pdf/renderer';
import moment from 'moment/moment';
import BirdViewLogo from "../../../../../../../../public/map/images/Birdview.png";
// Types
import { ReportCreationLog } from '@/Pages/home/service-orders/reports/types';

interface IProps {
    responsible?: string;
    name: string;
    city: string;
    state: string;
    farm: string;
    client?: string;
    area: string;
    date: string;
    number: string;
    dosage: string;
    provider: string;
    logs: ReportCreationLog[];
}

// Create styles
const styles = StyleSheet.create({
    viewer: {
        width: "100%",
        height: "700px"
    },
    page: {
        display: 'flex',
        flexDirection: 'column',
        padding: 50,
    },
    section: {
        width: '100%',
        marginBottom: '20px'
    },
    table_section: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        padding: 0
    },
    table_row: {
        display: 'flex',
        flexDirection: 'row',
        height: '20px'
    },
    table_head: {
        border: '1px solid #000',
        padding: '4px',
        fontSize: '10px',
        flexShrink: 0,
        flexGrow: 0,
        fontWeight: 'bold',
        backgroundColor: '#A0A0A0'
    },
    table_data: {
        border: '1px solid #000',
        padding: '3px',
        fontSize: '10px',
        flexShrink: 0,
        flexGrow: 0
    },
    top_legends: {
        padding: '5px 5px 5px 0',
        fontSize: '12px',
        fontWeight: 900

    },
    logo: {
        width: '90px',
        height: '40px',
        marginBottom: '20px'
    }
});

export const ReportDocument = React.memo((props: { data: IProps }) => {

    function renderImagePages() {
        let pages = [];
        for (let i = 0; i < props.data.logs.length; i += 2) {

            // If there is a next image, render it
            if (i + 1 < props.data.logs.length) {
                pages.push(
                    <Page size="A4" style={styles.page} key={props.data.logs[i].timestamp}>
                        <View style={styles.section}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{i + 1}</Text>
                            <Image src={props.data.logs[i].image_url}></Image>
                        </View>
                        <View style={styles.section}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{i + 2}</Text>
                            <Image src={props.data.logs[i + 1].image_url}></Image>
                        </View>
                    </Page>
                );
            } else {
                pages.push(
                    <Page size="A4" style={styles.page} key={props.data.logs[i].timestamp}>
                        <View style={styles.section}>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold' }}>{i + 1}</Text>
                            <Image src={props.data.logs[i].image_url}></Image>
                        </View>
                    </Page>
                );
            }

        }
        return pages;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.section}>
                    <Image src={BirdViewLogo} style={styles.logo}></Image>
                    <Text style={styles.top_legends}>{`RELATÓRIO: ${props.data.name}`.toUpperCase()}</Text>
                    <Text style={styles.top_legends}>{`CLIENTE: ${props.data.client}`.toUpperCase()}</Text>
                    <Text style={styles.top_legends}>{`REGIÃO: ${props.data.city}, ${props.data.state}`.toUpperCase()}</Text>
                    <Text style={styles.top_legends}>{`FAZENDA: ${props.data.farm}`.toUpperCase()}</Text>
                </View>
                <View style={styles.table_section}>
                    <View style={styles.table_row}>
                        <Text style={{ ...styles.table_head, flexBasis: '160px', textAlign: 'center' }}>{"ÁREA TOTAL APLICADA (ha)"}</Text>
                        <Text style={{ ...styles.table_head, flexBasis: '130px', textAlign: 'center' }}>{"DATA DA APLICAÇÃO"}</Text>
                        <Text style={{ ...styles.table_head, flexBasis: '115px', textAlign: 'center' }}>{"Nº DA APLICAÇÃO"}</Text>
                        <Text style={{ ...styles.table_head, flexBasis: '100px', textAlign: 'center' }}>{"DOSAGEM/Ha"}</Text>
                    </View>
                    <View style={styles.table_row}>
                        <Text style={{ ...styles.table_data, flexBasis: '160px', textAlign: 'center' }}>{props.data.area}</Text>
                        <Text style={{ ...styles.table_data, flexBasis: '130px', textAlign: 'center' }}>{moment(props.data.date).format('DD/MM/YYYY')}</Text>
                        <Text style={{ ...styles.table_data, flexBasis: '115px', textAlign: 'center' }}>{props.data.number}</Text>
                        <Text style={{ ...styles.table_data, flexBasis: '100px', textAlign: 'center' }}>{props.data.dosage}</Text>
                    </View>
                </View>
                {/* Tables */}
                {props.data.logs.map((log: ReportCreationLog, index) => (
                    <View style={styles.table_section} key={log.timestamp}>
                        <View style={styles.table_row}>
                            <Text style={{ ...styles.table_head, flexBasis: '200px', textAlign: 'center' }}>{"CONDIÇÕES CLIMÁTICAS " + (Number(index) + 1)}</Text>
                            <Text style={{ ...styles.table_head, flexBasis: '155px', textAlign: 'center' }}>{"INICIAL"}</Text>
                            <Text style={{ ...styles.table_head, flexBasis: '155px', textAlign: 'center' }}>{"FINAL"}</Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={{ ...styles.table_data, flexBasis: '200px', textAlign: 'center' }}>{"TEMPERATURA (Cº)"}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '155px', textAlign: 'center' }}>{log.extra_data.temperature.initial}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '155px', textAlign: 'center' }}>{log.extra_data.temperature.final}</Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={{ ...styles.table_data, flexBasis: '200px', textAlign: 'center' }}>{"UMIDADE"}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '155px', textAlign: 'center' }}>{log.extra_data.humidity.initial}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '155px', textAlign: 'center' }}>{log.extra_data.humidity.final}</Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={{ ...styles.table_data, flexBasis: '200px', textAlign: 'center' }}>{"VENTO (Km/h)"}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '155px', textAlign: 'center' }}>{log.extra_data.wind_speed.initial}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '155px', textAlign: 'center' }}>{log.extra_data.wind_speed.final}</Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={{ ...styles.table_data, flexBasis: '200px', textAlign: 'center' }}>{"FORNECEDOR"}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '310px', textAlign: 'center' }}>{props.data.provider}</Text>
                        </View>
                        <View style={styles.table_row}>
                            <Text style={{ ...styles.table_data, flexBasis: '200px', textAlign: 'center' }}>{"RESPONSÁVEL"}</Text>
                            <Text style={{ ...styles.table_data, flexBasis: '310px', textAlign: 'center' }}>{props.data.responsible}</Text>
                        </View>
                    </View>
                ))}
            </Page>
            {renderImagePages()}
        </Document >
    )
});

export const ReportVisualization = React.memo((props: { data: IProps }) => {

    const [open, setOpen] = React.useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Ver relatório
            </button>
            {open &&
                <div className="relative z-50">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
                    <div id="report-visualization" className="flex items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal">
                        <div className="relative w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <PDFViewer style={styles.viewer}>
                                    <ReportDocument data={props.data} />
                                </PDFViewer>
                                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button onClick={() => setOpen(false)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Fechar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    )
});
