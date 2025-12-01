import jsPDF from "jspdf";

/**
 * Hook xử lý export functionality
 */
export const useAnalyticsExport = () => {
  const exportPDF = async (
    selectedSession,
    barData,
    stats,
    dominantEmotion
  ) => {
    if (!selectedSession) {
      alert("Vui lòng chọn một buổi học trước!");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      doc.setFontSize(18);
      doc.setTextColor(13, 110, 253);
      doc.text("📊 BÁO CÁO PHÂN TÍCH LỚP HỌC", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 12;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Được tạo: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      yPos += 15;

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("THÔNG TIN BUỔI HỌC", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Môn Học: ${selectedSession?.subject || "N/A"}`, 20, yPos);
      yPos += 6;
      doc.text(
        `Ngày: ${new Date(selectedSession?.created_at).toLocaleDateString(
          "vi-VN"
        )}`,
        20,
        yPos
      );
      yPos += 15;

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("THỐNG KÊ CẢM XÚC", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);

      const emotions = [
        "Vui vẻ",
        "Buồn",
        "Giận dữ",
        "Ngạc nhiên",
        "Bình thường",
        "Ghê tởm",
        "Sợ hãi",
      ];
      const totalFrames = barData.reduce((a, b) => a + b, 0) || 1;

      emotions.forEach((emotion, idx) => {
        const count = barData[idx] || 0;
        const percentage = ((count / totalFrames) * 100).toFixed(1);
        doc.text(`${emotion}: ${count} (${percentage}%)`, 20, yPos);
        yPos += 6;
      });

      yPos += 5;

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("CHỈ SỐ HIỆU SUẤT", 15, yPos);
      yPos += 8;
      doc.setFontSize(10);

      doc.text(`Mức độ hứng thú: ${stats.engagement}%`, 20, yPos);
      yPos += 6;
      doc.text(`Tỷ lệ tích cực: ${stats.positive}%`, 20, yPos);
      yPos += 6;
      doc.text(`Cảm xúc chủ đạo: ${dominantEmotion}`, 20, yPos);

      doc.save(
        `Class_Analytics_${selectedSession?.id}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const exportCSV = (selectedSession, barData, stats, dominantEmotion) => {
    if (!selectedSession) {
      alert("Vui lòng chọn một buổi học trước!");
      return;
    }

    try {
      const emotions = [
        "Happy",
        "Sad",
        "Angry",
        "Surprise",
        "Neutral",
        "Disgust",
        "Fear",
      ];

      let csv = "Báo Cáo Phân Tích Lớp Học\n";
      csv += `Tạo: ${new Date().toLocaleString()}\n\n`;

      csv += "THÔNG TIN BUỔI HỌC\n";
      csv += `Môn Học,${selectedSession?.subject || "N/A"}\n`;
      csv += `ID Giáo Viên,${selectedSession?.teacher_id || "N/A"}\n`;
      csv += `Date,${new Date(selectedSession?.created_at).toLocaleDateString(
        "vi-VN"
      )}\n\n`;

      csv += "THỐNG KÊ CẢM XÚC\n";
      csv += "Cảm Xúc,Số Lượng,Tỷ Lệ\n";
      const totalFrames = barData.reduce((a, b) => a + b, 0) || 1;
      emotions.forEach((emotion, idx) => {
        const percentage = ((barData[idx] / totalFrames) * 100).toFixed(1);
        csv += `${emotion},${barData[idx] || 0},${percentage}%\n`;
      });

      csv += "\nCHỈ SỐ HIỆU SUẤT\n";
      csv += "Chỉ Số,Giá Trị\n";
      csv += `Mức độ hứng thú,${stats.engagement}%\n`;
      csv += `Tỷ lệ tích cực,${stats.positive}%\n`;
      csv += `Cảm xúc chủ đạo,${dominantEmotion}\n`;

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Class_Analytics_${selectedSession?.id}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting CSV");
    }
  };

  const exportJSON = (selectedSession, barData, stats, dominantEmotion) => {
    if (!selectedSession) {
      alert("Vui lòng chọn một buổi học trước!");
      return;
    }

    try {
      const emotions = [
        "Vui vẻ",
        "Buồn",
        "Giận dữ",
        "Ngạc nhiên",
        "Bình thường",
        "Ghê tởm",
        "Sợ hãi",
      ];

      const reportData = {
        loai_bao_cao: "Báo Cáo Phân Tích Lớp Học",
        tao_luc: new Date().toISOString(),
        buoi_hoc: {
          id: selectedSession?.id,
          subject: selectedSession?.subject,
          teacher_id: selectedSession?.teacher_id,
          created_at: selectedSession?.created_at,
        },
        emotions: emotions.reduce((acc, emotion, idx) => {
          acc[emotion] = barData[idx] || 0;
          return acc;
        }, {}),
        metrics: {
          muc_do_hung_thu: stats.engagement,
          ty_le_tich_cuc: stats.positive,
          cam_xuc_chu_dao: dominantEmotion,
        },
      };

      const json = JSON.stringify(reportData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Class_Analytics_${selectedSession?.id}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("JSON exported successfully!");
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert("Error exporting JSON");
    }
  };

  const exportAllPDF = async (filteredSessions) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      doc.setFontSize(18);
      doc.text("📊 ALL CLASSES REPORT", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 12;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated: ${new Date().toLocaleString("vi-VN")}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      doc.text(
        `Total Sessions: ${filteredSessions.length}`,
        pageWidth / 2,
        yPos + 5,
        { align: "center" }
      );
      yPos += 15;

      doc.setFontSize(9);
      doc.setTextColor(0);
      filteredSessions.forEach((session, idx) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(
          `${idx + 1}. ${session.subject} - ${session.dominantEmotion} (${
            session.positiveRate
          }%)`,
          15,
          yPos
        );
        yPos += 5;
      });

      const filename = `All_Classes_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);
      alert("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error exporting PDF");
    }
  };

  const exportAllCSV = (filteredSessions) => {
    try {
      let csv = "All Classes Report\n";
      csv += `Generated: ${new Date().toLocaleString("vi-VN")}\n\n`;

      csv += "DATE,SUBJECT,TEACHER,DOMINANT_EMOTION,POSITIVE_RATE,STATUS\n";

      filteredSessions.forEach((session) => {
        csv += `"${new Date(session.created_at).toLocaleDateString(
          "vi-VN"
        )}","${session.subject || "N/A"}","${session.teacher_id || "N/A"}","${
          session.dominantEmotion
        }","${session.positiveRate}%","${session.status || "N/A"}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `All_Classes_Report_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting CSV");
    }
  };

  return {
    exportPDF,
    exportCSV,
    exportJSON,
    exportAllPDF,
    exportAllCSV,
  };
};
