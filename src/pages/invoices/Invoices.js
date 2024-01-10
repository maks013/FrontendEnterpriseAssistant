import React, {useEffect, useState} from 'react';
import Header from '../../components/header/Header';
import './Invoices.scss';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";
import InvoiceCard from "./invoice-card/InvoiceCard";

const Invoices = () => {
    useAuth();
    const [invoicesData, setInvoicesData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const invoiceResponse = await fetch('http://localhost:8080/invoices', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!invoiceResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await invoiceResponse.json();
                setInvoicesData(data.map(invoice => ({
                    id: invoice.id,
                    number: invoice.number,
                    issueDate: invoice.issueDate,
                    orderId: invoice.orderId
                })));

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="home-orders">
            <Header/>
            <div className="invoice-list">
                {invoicesData.map((invoice, index) => (
                    <InvoiceCard
                        key={index}
                        id={invoice.id}
                        number={invoice.number}
                        issueDate={invoice.issueDate}
                        orderId={invoice.orderId}
                    />
                ))}
            </div>
        </div>
    );
};

export default Invoices;
