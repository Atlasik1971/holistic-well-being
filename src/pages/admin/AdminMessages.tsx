import SubmissionsList from "@/components/admin/SubmissionsList";

const AdminMessages = () => (
  <SubmissionsList
    table="contact_messages"
    title="Сообщения с сайта"
    description="Сообщения, оставленные через форму на странице «Контакты»."
    bodyField="message"
  />
);

export default AdminMessages;
