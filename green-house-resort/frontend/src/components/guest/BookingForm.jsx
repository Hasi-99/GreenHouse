// Handle Booking Submission
  const handleBookRoom = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to book a room!");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Save to Database (Code we already wrote)
      const { data, error } = await supabase.from('bookings').insert([
        {
          guest_id: user.id,
          room_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice,
          add_ons: selectedAddOns,
          status: 'confirmed'
        }
      ]);

      if (error) throw error;

      // 2. NEW: Trigger the Edge Function to send the emails!
      await supabase.functions.invoke('send-email', {
        body: {
          action: 'booking',
          guestEmail: user.email, 
          guestName: user.user_metadata?.full_name || 'Valued Guest',
          roomName: room.name,
          price: totalPrice.toFixed(2),
          checkIn: checkIn,
          checkOut: checkOut
        }
      });

      alert('Booking successful! A confirmation email has been sent.');
      
    } catch (error) {
      console.error('Error booking room:', error.message);
      alert('Failed to book the room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };