import SubmissionsList from "@/components/admin/SubmissionsList";

const AdminBookings = () => (
  <SubmissionsList
    table="bookings"
    title="Заявки на консультацию"
    description="Заполненные анкеты со страницы «Запись»."
    bodyField="request"
    showFormat
  />
);

export default AdminBookings;
