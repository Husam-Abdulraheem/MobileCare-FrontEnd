import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';
import logo from "../../public/favicon.ico";

const PrintOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      const docRef = doc(db, "repairOrders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate("/orders");
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  useEffect(() => {
    if (order) {
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          navigate('/orders');
        }, 300);
      }, 500);
    }
  }, [order, navigate]);

  if (!order) return <div style={{ padding: 40 }}>{t('loading')}</div>;

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      background: '#fff',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        margin: '0 auto',
        padding: '32px 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: 8, marginBottom: 10, boxShadow: '0 2px 8px #0001' }} />
        <h2 style={{ color: '#2563eb', fontWeight: 700, fontSize: 24, letterSpacing: 0.5, margin: 0, marginBottom: 18 }}>{t('repairOrderReceipt')}</h2>
        <table style={{ width: '100%', fontSize: 15, marginBottom: 18, borderCollapse: 'separate', borderSpacing: 0 }}>
          <tbody>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0', width: 120 }}>{t('customerName')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.customerName}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('phoneNumber')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.phoneNumber}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('deviceBrand')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.deviceBrand}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('deviceModel')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.deviceModel}</td>
            </tr>
            {order.imei && (
              <tr>
                <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>IMEI</td>
                <td style={{ color: '#222', fontWeight: 500 }}>{order.imei}</td>
              </tr>
            )}
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('problemDescription')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.problemDescription}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('deviceCondition')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.deviceCondition}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('estimatedCost')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.estimatedCost} $</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('lastUpdatedAt')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.updatedAt ? format(new Date(order.updatedAt), 'dd/MM/yyyy') : '-'}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('status')}</td>
              <td style={{ color: '#222', fontWeight: 500 }}>{order.status}</td>
            </tr>
            {order.trackCode && (
              <tr>
                <td style={{ color: '#64748b', fontWeight: 600, padding: '7px 0' }}>{t('trackCode')}</td>
                <td style={{ color: '#222', fontWeight: 500 }}>{order.trackCode}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{
          textAlign: 'right',
          color: '#64748b',
          fontSize: 13,
          marginBottom: 18,
          fontWeight: 500,
          width: '100%'
        }}>
          {t('printDate')}: <span style={{ color: '#222', fontWeight: 600 }}>{format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        {/* No navigation button on print page */}
      </div>
    </div>
  );
};

export default PrintOrder;
