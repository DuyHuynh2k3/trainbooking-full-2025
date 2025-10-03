//src/client/components/PdfViewer.js:
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: "40%",
  },
});

const TicketDocument = ({ ticket }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>VÉ TÀU HỎA</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Mã vé:</Text>
          <Text>{ticket.ticket_id}</Text>
        </View>
        {/* Thêm các thông tin khác tương tự */}
      </View>

      {ticket.qr_code_url && (
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Image src={ticket.qr_code_url} style={{ width: 150, height: 150 }} />
          <Text style={{ marginTop: 10 }}>Quét mã QR để kiểm tra vé</Text>
        </View>
      )}
    </Page>
  </Document>
);

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketId = searchParams.get("ticket_id");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/infoSeat?ticket_id=${ticketId}`);
        if (!response.ok) throw new Error("Không tìm thấy vé");
        const data = await response.json();
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchTicket();
  }, [ticketId]);

  if (loading) return <div className="text-center p-5">Đang tải vé...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket)
    return (
      <div className="alert alert-warning">Không tìm thấy thông tin vé</div>
    );

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <PDFViewer width="100%" height="100%">
        <TicketDocument ticket={ticket} />
      </PDFViewer>
    </div>
  );
};

export default PdfViewer;
