import SubmissionsList from "@/components/admin/SubmissionsList";

const AdminChatLeads = () => (
  <SubmissionsList
    table="chat_leads"
    title="Контакты из чата"
    description="Имена и контакты, оставленные через AI-чат."
    bodyField="message"
  />
);

export default AdminChatLeads;
