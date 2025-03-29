--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: archived_records; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.archived_records (
    record_id integer NOT NULL,
    original_id integer NOT NULL,
    type character varying(50) NOT NULL,
    data_snapshot text NOT NULL,
    archived_at timestamp without time zone NOT NULL,
    CONSTRAINT archived_records_type_check CHECK (((type)::text = ANY ((ARRAY['Reservation'::character varying, 'Rental'::character varying])::text[])))
);


ALTER TABLE public.archived_records OWNER TO root;

--
-- Name: archived_records_record_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.archived_records_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.archived_records_record_id_seq OWNER TO root;

--
-- Name: archived_records_record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.archived_records_record_id_seq OWNED BY public.archived_records.record_id;


--
-- Name: hotel; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.hotel (
    hotel_id integer NOT NULL,
    chain_id integer NOT NULL,
    name character varying(255) NOT NULL,
    classification integer NOT NULL,
    num_rooms integer NOT NULL,
    address character varying(255) NOT NULL,
    contact_email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    CONSTRAINT hotel_classification_check CHECK (((classification >= 1) AND (classification <= 5)))
);


ALTER TABLE public.hotel OWNER TO root;

--
-- Name: room; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.room (
    room_id integer NOT NULL,
    hotel_id integer NOT NULL,
    price numeric(10,2) NOT NULL,
    capacity integer NOT NULL,
    view character varying(50) NOT NULL,
    extendable boolean NOT NULL,
    condition character varying(50) NOT NULL,
    amenities text NOT NULL,
    CONSTRAINT room_capacity_check CHECK ((capacity = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT room_condition_check CHECK (((condition)::text = ANY ((ARRAY['Damaged'::character varying, 'In Repair'::character varying, 'Good Condition'::character varying])::text[]))),
    CONSTRAINT room_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT room_view_check CHECK (((view)::text = ANY ((ARRAY['Sea View'::character varying, 'Mountain View'::character varying, 'City View'::character varying])::text[])))
);


ALTER TABLE public.room OWNER TO root;

--
-- Name: available_rooms_by_area; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.available_rooms_by_area AS
 SELECT h.address AS hotel_address,
    count(r.room_id) AS available_rooms
   FROM (public.hotel h
     JOIN public.room r ON ((h.hotel_id = r.hotel_id)))
  WHERE ((r.condition)::text = 'Good Condition'::text)
  GROUP BY h.address;


ALTER TABLE public.available_rooms_by_area OWNER TO root;

--
-- Name: reservation; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.reservation (
    reservation_id integer NOT NULL,
    guest_id integer NOT NULL,
    room_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status character varying(50) NOT NULL,
    CONSTRAINT reservation_status_check CHECK (((status)::text = ANY ((ARRAY['Booked'::character varying, 'Checked-in'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.reservation OWNER TO root;

--
-- Name: availableroomsbyarea; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.availableroomsbyarea AS
 SELECT h.address,
    count(r.room_id) AS available_rooms
   FROM (public.hotel h
     JOIN public.room r ON ((h.hotel_id = r.hotel_id)))
  WHERE (NOT (r.room_id IN ( SELECT reservation.room_id
           FROM public.reservation
          WHERE ((reservation.status)::text = 'Booked'::text))))
  GROUP BY h.address;


ALTER TABLE public.availableroomsbyarea OWNER TO root;

--
-- Name: employee; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.employee (
    employee_id integer NOT NULL,
    hotel_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    sin character varying(20) NOT NULL,
    role character varying(100) NOT NULL,
    CONSTRAINT employee_role_check CHECK (((role)::text = ANY ((ARRAY['Manager'::character varying, 'Receptionist'::character varying, 'Housekeeper'::character varying])::text[])))
);


ALTER TABLE public.employee OWNER TO root;

--
-- Name: employee_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employee_employee_id_seq OWNER TO root;

--
-- Name: employee_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.employee_employee_id_seq OWNED BY public.employee.employee_id;


--
-- Name: guest; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.guest (
    guest_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    sin character varying(20) NOT NULL,
    date_of_checkin date NOT NULL,
    CONSTRAINT guest_sin_check CHECK (((sin)::text ~ '^\d{9}$'::text))
);


ALTER TABLE public.guest OWNER TO root;

--
-- Name: guest_guest_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.guest_guest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.guest_guest_id_seq OWNER TO root;

--
-- Name: guest_guest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.guest_guest_id_seq OWNED BY public.guest.guest_id;


--
-- Name: hotel_hotel_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.hotel_hotel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hotel_hotel_id_seq OWNER TO root;

--
-- Name: hotel_hotel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.hotel_hotel_id_seq OWNED BY public.hotel.hotel_id;


--
-- Name: hotelchain; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.hotelchain (
    chain_id integer NOT NULL,
    name character varying(255) NOT NULL,
    central_address character varying(255) NOT NULL,
    num_hotels integer NOT NULL,
    contact_email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL
);


ALTER TABLE public.hotelchain OWNER TO root;

--
-- Name: hotelchain_chain_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.hotelchain_chain_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hotelchain_chain_id_seq OWNER TO root;

--
-- Name: hotelchain_chain_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.hotelchain_chain_id_seq OWNED BY public.hotelchain.chain_id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    rental_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_date timestamp without time zone NOT NULL,
    CONSTRAINT payment_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT payment_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['Credit Card'::character varying, 'Debit Card'::character varying, 'Cash'::character varying, 'Bank Transfer'::character varying])::text[])))
);


ALTER TABLE public.payment OWNER TO root;

--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_payment_id_seq OWNER TO root;

--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- Name: rental; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rental (
    rental_id integer NOT NULL,
    reservation_id integer NOT NULL,
    guest_id integer NOT NULL,
    room_id integer NOT NULL,
    employee_id integer NOT NULL,
    checkin_date date NOT NULL,
    checkout_date date NOT NULL
);


ALTER TABLE public.rental OWNER TO root;

--
-- Name: rental_rental_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rental_rental_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_rental_id_seq OWNER TO root;

--
-- Name: rental_rental_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rental_rental_id_seq OWNED BY public.rental.rental_id;


--
-- Name: reservation_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.reservation_reservation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservation_reservation_id_seq OWNER TO root;

--
-- Name: reservation_reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.reservation_reservation_id_seq OWNED BY public.reservation.reservation_id;


--
-- Name: room_capacity_by_hotel; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.room_capacity_by_hotel AS
 SELECT room.hotel_id,
    room.capacity,
    count(*) AS count
   FROM public.room
  GROUP BY room.hotel_id, room.capacity
  ORDER BY room.hotel_id, room.capacity;


ALTER TABLE public.room_capacity_by_hotel OWNER TO root;

--
-- Name: room_room_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.room_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.room_room_id_seq OWNER TO root;

--
-- Name: room_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.room_room_id_seq OWNED BY public.room.room_id;


--
-- Name: archived_records record_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.archived_records ALTER COLUMN record_id SET DEFAULT nextval('public.archived_records_record_id_seq'::regclass);


--
-- Name: employee employee_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.employee ALTER COLUMN employee_id SET DEFAULT nextval('public.employee_employee_id_seq'::regclass);


--
-- Name: guest guest_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.guest ALTER COLUMN guest_id SET DEFAULT nextval('public.guest_guest_id_seq'::regclass);


--
-- Name: hotel hotel_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotel ALTER COLUMN hotel_id SET DEFAULT nextval('public.hotel_hotel_id_seq'::regclass);


--
-- Name: hotelchain chain_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotelchain ALTER COLUMN chain_id SET DEFAULT nextval('public.hotelchain_chain_id_seq'::regclass);


--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- Name: rental rental_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental ALTER COLUMN rental_id SET DEFAULT nextval('public.rental_rental_id_seq'::regclass);


--
-- Name: reservation reservation_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.reservation ALTER COLUMN reservation_id SET DEFAULT nextval('public.reservation_reservation_id_seq'::regclass);


--
-- Name: room room_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.room ALTER COLUMN room_id SET DEFAULT nextval('public.room_room_id_seq'::regclass);


--
-- Data for Name: archived_records; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.archived_records (record_id, original_id, type, data_snapshot, archived_at) FROM stdin;
1	33	Reservation	{"reservation_id":33,"guest_id":3,"room_id":23,"start_date":"2025-03-03T05:00:00.000Z","end_date":"2025-03-05T05:00:00.000Z","status":"Booked"}	2025-03-02 21:22:49.312139
2	1	Rental	{"rental_id":1,"reservation_id":31,"guest_id":1,"room_id":21,"employee_id":2,"checkin_date":"2025-03-01T05:00:00.000Z","checkout_date":"2025-03-03T05:00:00.000Z"}	2025-03-02 21:23:19.201803
3	1	Rental	{"rental_id":1,"reservation_id":31,"guest_id":1,"room_id":21,"employee_id":2,"checkin_date":"2025-03-01T05:00:00.000Z","checkout_date":"2025-03-03T05:00:00.000Z"}	2025-03-02 21:26:34.835793
4	1	Rental	{"rental_id":1,"reservation_id":31,"guest_id":1,"room_id":21,"employee_id":2,"checkin_date":"2025-03-01T05:00:00.000Z","checkout_date":"2025-03-03T05:00:00.000Z"}	2025-03-02 21:27:15.481739
5	1	Rental	{"rental_id":1,"reservation_id":31,"guest_id":1,"room_id":21,"employee_id":2,"checkin_date":"2025-03-01T05:00:00.000Z","checkout_date":"2025-03-03T05:00:00.000Z"}	2025-03-02 21:27:30.146894
6	1	Rental	{"rental_id":1,"reservation_id":31,"guest_id":1,"room_id":21,"employee_id":2,"checkin_date":"2025-03-01T05:00:00.000Z","checkout_date":"2025-03-03T05:00:00.000Z"}	2025-03-02 21:30:27.137157
7	33	Reservation	{"reservation_id":33,"guest_id":3,"room_id":23,"start_date":"2025-03-03T05:00:00.000Z","end_date":"2025-03-05T05:00:00.000Z","status":"Booked"}	2025-03-02 21:30:40.724173
8	3	Rental	{"rental_id":3,"reservation_id":47,"guest_id":1,"room_id":40,"employee_id":1,"checkin_date":"2000-01-01T05:00:00.000Z","checkout_date":"2000-01-30T05:00:00.000Z"}	2025-03-03 15:01:29.543774
9	4	Rental	{"rental_id":4,"reservation_id":47,"guest_id":1,"room_id":40,"employee_id":1,"checkin_date":"2000-01-01T05:00:00.000Z","checkout_date":"2000-01-30T05:00:00.000Z"}	2025-03-03 15:02:14.97862
12	11	Rental	{"rental_id":11,"reservation_id":54,"guest_id":1,"room_id":25,"employee_id":1,"checkin_date":"2025-03-21T04:00:00.000Z","checkout_date":"2025-03-21T04:00:00.000Z","totalamount":"242.00","payments":[{"payment_id":7,"amount":242,"payment_method":"Credit Card","payment_date":"2025-03-22T01:35:25.155"}]}	2025-03-21 21:35:27.968048
13	12	Rental	{"rental_id":12,"reservation_id":54,"guest_id":1,"room_id":25,"employee_id":1,"checkin_date":"2025-03-21T04:00:00.000Z","checkout_date":"2025-03-21T04:00:00.000Z","totalamount":"242.00","payments":[{"payment_id":8,"amount":242,"payment_method":"Credit Card","payment_date":"2025-03-22T01:36:27.222"}]}	2025-03-21 21:36:31.663036
14	12	Rental	{"rental_id":12,"reservation_id":54,"guest_id":1,"room_id":25,"employee_id":1,"checkin_date":"2025-03-21T04:00:00.000Z","checkout_date":"2025-03-21T04:00:00.000Z","totalamount":"242.00","payments":[{"payment_id":8,"amount":242,"payment_method":"Credit Card","payment_date":"2025-03-22T01:36:27.222"}]}	2025-03-21 21:36:56.93678
15	12	Rental	{"rental_id":12,"reservation_id":54,"guest_id":1,"room_id":25,"employee_id":1,"checkin_date":"2025-03-21T04:00:00.000Z","checkout_date":"2025-03-21T04:00:00.000Z","totalamount":"242.00","payments":[{"payment_id":8,"amount":242,"payment_method":"Credit Card","payment_date":"2025-03-22T01:36:27.222"}]}	2025-03-21 21:37:48.428505
16	12	Rental	{"rental_id":12,"reservation_id":54,"guest_id":1,"room_id":25,"employee_id":1,"checkin_date":"2025-03-21T04:00:00.000Z","checkout_date":"2025-03-21T04:00:00.000Z","totalamount":"242.00","payments":[{"payment_id":8,"amount":242,"payment_method":"Credit Card","payment_date":"2025-03-22T01:36:27.222"}]}	2025-03-21 21:37:54.684965
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.employee (employee_id, hotel_id, full_name, address, sin, role) FROM stdin;
1	11	Alice Fisher	123 Ocean Ave, Miami, FL	223344556	Manager
2	11	Bob Martinez	456 Coral St, Miami, FL	334455667	Receptionist
3	12	Carla Wood	123 Mountain Rd, Denver, CO	445566778	Manager
4	12	Dan Walker	456 Aspen Ln, Denver, CO	556677889	Housekeeper
5	13	Eve Green	789 Broadway, New York, NY	667788990	Manager
6	13	Frank Harris	101 5th Ave, New York, NY	778899001	Receptionist
7	14	Grace Brown	123 Sunset Blvd, Los Angeles, CA	889900112	Manager
8	14	Harry Wilson	456 Palm St, Los Angeles, CA	990011223	Housekeeper
11	15	Isaac Walker	123 Low-Cost Rd, Austin, TX	112233445	Manager
12	15	Jack Black	789 Budget Ln, Austin, TX	223344559	Receptionist
13	7	Test Employee	Ottawa	000000000	Housekeeper
\.


--
-- Data for Name: guest; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.guest (guest_id, full_name, address, sin, date_of_checkin) FROM stdin;
1	John Doe	123 Ocean Ave, Miami, FL	123456789	2025-03-01
2	Jane Smith	456 Coral St, Miami, FL	987654321	2025-03-02
3	Alice Johnson	123 Mountain Rd, Denver, CO	111223344	2025-03-03
4	Bob Brown	456 Aspen Ln, Denver, CO	112233445	2025-03-04
5	Charlie White	789 Broadway, New York, NY	223344556	2025-03-05
6	David Green	101 5th Ave, New York, NY	334455667	2025-03-06
7	Eva Davis	123 Sunset Blvd, Los Angeles, CA	445566778	2025-03-07
8	Frank Miller	456 Palm St, Los Angeles, CA	556677889	2025-03-08
9	Grace Wilson	123 Low-Cost Rd, Austin, TX	667788990	2025-03-09
10	Henry Lee	789 Budget Ln, Austin, TX	778899001	2025-03-10
11	Hamed	Ottawa	000000000	2025-03-21
13	Test Guest	Ottawa	000000001	2025-03-25
\.


--
-- Data for Name: hotel; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.hotel (hotel_id, chain_id, name, classification, num_rooms, address, contact_email, telephone) FROM stdin;
3	1	The Ritz New York	5	10	1 Park Ave, New York, NY	ritznyc@example.com	+1 212-555-1235
4	1	The Plaza New York	5	8	59th St, New York, NY	plaza@example.com	+1 212-555-1236
5	1	The Savoy California	5	6	Santa Monica Blvd, LA, CA	savoy@example.com	+1 323-555-1237
6	1	The Royal Palm California	5	5	Palo Alto, CA	royalpalms@example.com	+1 650-555-1238
7	1	The Majestic California	4	5	Beverly Hills, CA	majestic@example.com	+1 310-555-1239
8	1	The Grand California	4	6	Hollywood Blvd, LA, CA	grandcalifornia@example.com	+1 323-555-1240
9	1	The Elite California	4	6	Venice Beach, CA	elitecalifornia@example.com	+1 310-555-1241
10	1	The Paramount California	4	5	Santa Monica, CA	paramount@example.com	+1 310-555-1242
11	11	Oceanic Bay Resort	5	10	123 Ocean Bay, Miami, FL	contact@oceanicbay.com	305-555-1001
12	11	Oceanic Harbor Hotel	4	12	456 Harbor St, Miami, FL	contact@oceanicharbor.com	305-555-1002
13	11	Oceanic Paradise	5	8	789 Paradise Rd, Miami, FL	contact@oceanicparadise.com	305-555-1003
14	11	Oceanic Shores Inn	3	10	101 Shores Blvd, Miami, FL	contact@oceanicshores.com	305-555-1004
15	11	Oceanic Breeze Resort	4	9	102 Breeze Dr, Miami, FL	contact@oceanicbreeze.com	305-555-1005
16	11	Oceanic Sunset Retreat	3	6	103 Sunset Blvd, Miami, FL	contact@oceanicsunset.com	305-555-1006
17	11	Oceanic Coastline	4	7	104 Coastline Ave, Miami, FL	contact@oceaniccoastline.com	305-555-1007
18	11	Oceanic Vista Hotel	5	8	105 Vista Rd, Miami, FL	contact@oceanicvista.com	305-555-1008
19	12	Mountain Retreat	5	10	123 Mountain Rd, Denver, CO	info@mountainretreat.com	720-555-2001
20	12	Alpine Summit Resort	4	12	456 Summit Rd, Denver, CO	info@alpinesummit.com	720-555-2002
21	12	Rocky Peak Inn	4	8	789 Peak Rd, Denver, CO	info@rockypeakinn.com	720-555-2003
22	12	Cedar Woods Lodge	3	7	101 Cedar Ln, Denver, CO	info@cedarwoods.com	720-555-2004
23	12	Snowfall Lodge	4	9	102 Snowfall Dr, Denver, CO	info@snowfalllodge.com	720-555-2005
24	12	Silver Pine Inn	3	6	103 Pine Rd, Denver, CO	info@silverpineinn.com	720-555-2006
25	12	Summit View Hotel	5	11	104 Summit View, Denver, CO	info@summitview.com	720-555-2007
26	12	Evergreen Resort	5	10	105 Evergreen St, Denver, CO	info@evergreenresort.com	720-555-2008
27	13	Skyline Tower	5	15	123 Skyline St, New York, NY	support@skylinetower.com	212-555-3001
28	13	Central Park Inn	4	10	456 Park Ave, New York, NY	support@centralparkinn.com	212-555-3002
29	13	City Plaza Hotel	4	12	789 Plaza Rd, New York, NY	support@cityplazahotel.com	212-555-3003
30	13	Downtown Luxury	5	9	101 Downtown St, New York, NY	support@downtownluxury.com	212-555-3004
31	13	Grand City Hotel	5	11	102 Grand Blvd, New York, NY	support@grandcityhotel.com	212-555-3005
32	13	Urban Heights Hotel	3	8	103 Heights Ave, New York, NY	support@urbanheights.com	212-555-3006
33	13	Empire City Inn	4	10	104 Empire Rd, New York, NY	support@empirecityinn.com	212-555-3007
34	13	Metropolitan Suites	5	13	105 Metropolitan St, New York, NY	support@metropolitansuites.com	212-555-3008
35	14	Golden Sands Resort	5	10	123 Golden Sands St, Los Angeles, CA	service@goldensands.com	310-555-4001
36	14	Majestic Palms Hotel	4	12	456 Majestic Blvd, Los Angeles, CA	service@majesticpalms.com	310-555-4002
37	14	Regal Heights Hotel	5	15	789 Regal Ave, Los Angeles, CA	service@regalheights.com	310-555-4003
38	14	Opulent View Resort	4	11	101 Opulent View Dr, Los Angeles, CA	service@opulentview.com	310-555-4004
39	14	Royal Oceanside	5	10	102 Royal Blvd, Los Angeles, CA	service@royaloceanside.com	310-555-4005
40	14	Diamond Retreat	5	12	103 Diamond Dr, Los Angeles, CA	service@diamondretreat.com	310-555-4006
41	14	Prestige Towers	4	9	104 Prestige Rd, Los Angeles, CA	service@prestigetowers.com	310-555-4007
42	14	Crown Ridge Resort	5	8	105 Crown Ridge, Los Angeles, CA	service@crownridge.com	310-555-4008
43	15	Inexpensive Stay Inn	2	10	123 Inexpensive St, Austin, TX	contact@inexpensivestay.com	512-555-5001
44	15	Budget Bunkhouse	3	12	456 Budget Rd, Austin, TX	contact@budgetbunkhouse.com	512-555-5002
45	15	Cheap Suites Hotel	2	8	789 Cheap Ave, Austin, TX	contact@cheapsuites.com	512-555-5003
46	15	Low-Cost Inn	1	6	101 Low-Cost Dr, Austin, TX	contact@lowcostinn.com	512-555-5004
47	15	Affordable Rest	3	7	102 Affordable St, Austin, TX	contact@affordablerest.com	512-555-5005
48	15	Economy Stay Inn	2	10	103 Economy Ave, Austin, TX	contact@economystay.com	512-555-5006
49	15	Budget Beachfront Hotel	3	9	104 Beachfront Rd, Austin, TX	contact@budgetbeachfront.com	512-555-5007
50	15	Value Park Inn	3	8	105 Value Park St, Austin, TX	contact@valueparkinn.com	512-555-5008
51	17	Test Hotel	1	0	Ottawa	mail@mail.com	111111111
\.


--
-- Data for Name: hotelchain; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.hotelchain (chain_id, name, central_address, num_hotels, contact_email, telephone) FROM stdin;
4	City Dreams	101 City Blvd, Midtown	8	hello@citydreams.com	4567890123
5	Ocean Breeze	202 Ocean Dr, Beachside	8	sales@oceanbreeze.com	5678901234
6	Luxury Hotels	123 High St, New York	8	luxury@example.com	+1 212-555-1234
7	Budget Stays	456 Economy Blvd, Los Angeles	8	budget@example.com	+1 323-555-5678
8	Resort Hotels	789 Beach Ave, Miami	8	resort@example.com	+1 305-555-7890
9	Business Suites	101 Office Park, Chicago	8	business@example.com	+1 312-555-1010
10	Eco Resorts	202 Green Rd, Portland	8	eco@example.com	+1 503-555-2020
1	LuxStay	123 Lux Ave, City Center	9	contact@luxstay.com	1234567890
2	BudgetInn	456 Budget St, Downtown	6	info@budgetinn.com	2345678901
11	Oceanic Hotels	123 Ocean Ave, Miami, FL	8	contact@oceanic.com	305-555-1234
12	Mountain Resorts	456 Mountain Rd, Denver, CO	8	info@mountainresorts.com	720-555-5678
13	Cityscape Hotels	789 City Blvd, New York, NY	8	support@cityscape.com	212-555-8765
14	Luxury Escapes	101 Luxury St, Los Angeles, CA	8	service@luxuryescapes.com	310-555-4321
15	Budget Inns	202 Budget Ave, Austin, TX	8	contact@budgetinns.com	512-555-9876
17	Test Chain	Test Address	0	email@mail.com	111111111
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.payment (payment_id, rental_id, amount, payment_method, payment_date) FROM stdin;
1	9	250.00	Debit Card	2025-03-22 00:54:09.954
2	8	10.00	Credit Card	2025-03-22 01:02:34.772
4	8	10.00	Bank Transfer	2025-03-22 01:05:05.756
5	8	10.00	Credit Card	2025-03-22 01:05:58.856
3	8	25.00	Credit Card	2025-03-22 05:04:55.639
6	9	10.00	Credit Card	2025-03-22 01:13:15.433
\.


--
-- Data for Name: rental; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rental (rental_id, reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date) FROM stdin;
2	35	5	25	8	2025-03-05	2025-03-07
5	47	1	40	1	2000-01-01	2000-01-30
6	50	5	20	7	2025-03-13	2025-03-26
7	51	4	22	6	2025-03-11	2025-03-26
8	34	4	24	3	2025-03-04	2025-03-06
9	32	2	22	1	2025-03-02	2025-03-04
10	53	1	22	1	2025-03-21	2025-03-28
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.reservation (reservation_id, guest_id, room_id, start_date, end_date, status) FROM stdin;
36	6	26	2025-03-06	2025-03-08	Booked
37	7	27	2025-03-07	2025-03-09	Booked
38	8	28	2025-03-08	2025-03-10	Booked
39	9	29	2025-03-09	2025-03-11	Booked
40	10	30	2025-03-10	2025-03-12	Booked
44	2	16	2025-03-01	2025-03-07	Booked
31	1	21	2025-03-01	2025-03-03	Checked-in
35	5	25	2025-03-05	2025-03-07	Checked-in
47	1	40	2000-01-01	2000-01-30	Checked-in
49	1	21	2025-03-13	2025-03-28	Booked
50	5	20	2025-03-13	2025-03-26	Checked-in
51	4	22	2025-03-11	2025-03-26	Checked-in
34	4	24	2025-03-04	2025-03-06	Checked-in
52	1	24	2025-03-04	2025-03-27	Booked
32	2	22	2025-03-02	2025-03-04	Checked-in
53	1	22	2025-03-21	2025-03-28	Checked-in
54	1	25	2025-03-21	2025-03-21	Checked-in
55	1	16	2025-03-23	2025-03-30	Booked
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.room (room_id, hotel_id, price, capacity, view, extendable, condition, amenities) FROM stdin;
16	4	500.00	1	Sea View	t	Good Condition	TV, Mini-Bar, Air-Conditioning
17	3	600.00	2	City View	f	Good Condition	TV, Mini-Bar, Air-Conditioning
18	3	700.00	3	Sea View	t	Good Condition	TV, Mini-Bar, Air-Conditioning, Bathtub
19	6	800.00	3	Mountain View	t	Good Condition	TV, Mini-Bar, Air-Conditioning, Jacuzzi
20	10	900.00	1	Mountain View	t	Good Condition	TV, Mini-Bar, Air-Conditioning, Jacuzzi, Private Pool
21	16	184.00	2	City View	t	Damaged	TV, Balcony, AC, Wi-Fi
22	16	250.00	1	Sea View	f	In Repair	Balcony, Mini Bar
23	16	330.00	1	Mountain View	t	In Repair	Wi-Fi, Balcony, Mini Bar
24	16	152.00	1	Mountain View	f	Good Condition	AC, Mini Bar, Balcony
25	16	242.00	3	Mountain View	f	Good Condition	TV, Balcony
26	17	196.00	2	Mountain View	t	In Repair	Mini Bar, TV
27	17	154.00	1	City View	f	Damaged	Mini Bar, Wi-Fi
28	17	151.00	2	Mountain View	t	In Repair	AC, Wi-Fi, Balcony
29	17	269.00	3	City View	f	In Repair	Balcony, AC, Mini Bar
30	17	283.00	3	City View	t	Good Condition	Wi-Fi, Mini Bar, TV, AC
31	18	288.00	2	City View	t	Damaged	Mini Bar, Wi-Fi, Balcony
32	18	279.00	2	Sea View	t	Damaged	TV, AC, Mini Bar, Balcony
33	18	195.00	2	Sea View	t	Good Condition	Mini Bar, Wi-Fi
34	18	194.00	3	Sea View	f	In Repair	Balcony, AC, TV
35	18	201.00	3	Sea View	t	In Repair	AC, Balcony
36	19	165.00	2	Mountain View	t	Damaged	TV, AC, Balcony
37	19	157.00	3	City View	f	Good Condition	Wi-Fi, TV
38	19	140.00	3	Sea View	f	Good Condition	Balcony, AC, TV, Wi-Fi
39	19	145.00	1	Sea View	f	Damaged	Wi-Fi, Mini Bar, AC, TV
40	19	192.00	3	City View	t	Damaged	Balcony, TV
41	20	174.00	1	Sea View	f	In Repair	Balcony, AC, Wi-Fi, Mini Bar
42	20	292.00	2	City View	t	Damaged	AC, Wi-Fi, Balcony, TV
43	20	276.00	3	City View	t	Damaged	Balcony, TV
44	20	283.00	1	Sea View	t	Good Condition	Balcony, Mini Bar, Wi-Fi
45	20	271.00	3	Sea View	f	Damaged	TV, Balcony, AC, Mini Bar
46	21	308.00	2	Mountain View	f	In Repair	Wi-Fi, Balcony, AC
47	21	247.00	2	Sea View	f	Damaged	Balcony, Mini Bar
48	21	249.00	1	City View	t	In Repair	Mini Bar, Balcony, TV, Wi-Fi
49	21	270.00	3	Mountain View	f	Good Condition	Mini Bar, Balcony, AC, Wi-Fi
50	21	142.00	3	Mountain View	t	Damaged	Balcony, Mini Bar, TV, AC
51	22	263.00	3	City View	t	Good Condition	TV, Balcony, Wi-Fi
52	22	241.00	2	Mountain View	f	Good Condition	Balcony, TV
53	22	271.00	3	City View	f	Damaged	Balcony, Wi-Fi
54	22	145.00	3	Sea View	f	In Repair	Balcony, AC, TV
55	22	275.00	2	City View	f	Damaged	AC, Wi-Fi, Mini Bar, TV
56	23	248.00	3	City View	t	Good Condition	Mini Bar, AC
57	23	151.00	1	Mountain View	t	In Repair	Mini Bar, TV
58	23	180.00	3	Sea View	t	In Repair	TV, AC, Balcony, Mini Bar
59	23	197.00	1	Mountain View	f	Good Condition	Mini Bar, AC
60	23	292.00	2	City View	t	Damaged	Mini Bar, AC, Wi-Fi, Balcony
61	24	142.00	1	City View	f	Damaged	Wi-Fi, Balcony, Mini Bar, AC
62	24	191.00	1	Sea View	f	Good Condition	Wi-Fi, Mini Bar, TV, AC
63	24	272.00	1	Mountain View	t	Good Condition	Wi-Fi, TV, AC, Balcony
64	24	159.00	2	City View	t	Good Condition	Mini Bar, Balcony
65	24	179.00	2	City View	t	Damaged	AC, Wi-Fi, Mini Bar, TV
66	25	288.00	3	City View	t	Good Condition	AC, Balcony, Wi-Fi
67	25	267.00	3	City View	t	Damaged	Mini Bar, Wi-Fi, Balcony
68	25	245.00	2	Mountain View	t	Good Condition	Wi-Fi, Mini Bar
69	25	248.00	3	Sea View	t	Good Condition	Wi-Fi, AC, TV, Mini Bar
70	25	311.00	1	Sea View	f	In Repair	TV, AC
71	26	173.00	2	City View	f	Damaged	TV, Mini Bar, AC
72	26	275.00	2	Mountain View	t	Damaged	AC, TV, Balcony, Wi-Fi
73	26	151.00	1	Mountain View	f	Good Condition	Wi-Fi, Mini Bar, AC
74	26	311.00	2	City View	f	Damaged	Mini Bar, AC, Wi-Fi, Balcony
75	26	266.00	1	Sea View	t	Good Condition	Balcony, AC, TV, Mini Bar
76	27	224.00	2	Sea View	f	Damaged	Balcony, TV, Mini Bar, AC
77	27	169.00	2	Mountain View	f	In Repair	AC, Balcony
78	27	144.00	2	Sea View	t	Good Condition	TV, AC
79	27	324.00	2	Sea View	t	Damaged	TV, Mini Bar, AC, Wi-Fi
80	27	167.00	2	Sea View	t	In Repair	Wi-Fi, Balcony, AC
81	28	183.00	2	Sea View	t	Damaged	Mini Bar, TV, Balcony
82	28	288.00	3	Sea View	t	In Repair	Wi-Fi, Balcony
83	28	172.00	3	Mountain View	t	Damaged	Wi-Fi, TV
84	28	282.00	2	Sea View	t	In Repair	Wi-Fi, Mini Bar, TV
85	28	189.00	2	Sea View	t	Good Condition	AC, Wi-Fi
86	29	304.00	3	City View	f	Good Condition	TV, AC, Mini Bar
87	29	319.00	1	City View	f	In Repair	TV, Wi-Fi
88	29	324.00	2	Sea View	f	Damaged	Mini Bar, Wi-Fi, AC, Balcony
89	29	313.00	2	Sea View	t	In Repair	TV, Mini Bar, Balcony, Wi-Fi
90	29	277.00	3	Mountain View	f	In Repair	Wi-Fi, Mini Bar
91	30	157.00	3	Sea View	f	Good Condition	TV, AC
92	30	144.00	1	City View	t	Damaged	TV, Wi-Fi
93	30	233.00	1	City View	f	Good Condition	AC, Mini Bar
94	30	259.00	3	City View	f	Good Condition	AC, Mini Bar, Wi-Fi
95	30	218.00	3	City View	f	In Repair	TV, Balcony, Wi-Fi, AC
96	31	143.00	2	Sea View	f	Good Condition	Wi-Fi, AC
97	31	308.00	3	City View	f	Good Condition	Balcony, TV, Mini Bar
99	31	166.00	1	Mountain View	t	Good Condition	Balcony, Mini Bar, Wi-Fi
100	31	198.00	1	City View	f	Damaged	Wi-Fi, Mini Bar, AC
101	32	217.00	2	Sea View	t	Good Condition	Balcony, Wi-Fi, AC
102	32	208.00	3	Sea View	f	Good Condition	Balcony, AC, Mini Bar, Wi-Fi
103	32	164.00	2	City View	t	Good Condition	AC, TV, Wi-Fi, Balcony
104	32	270.00	2	Sea View	t	Good Condition	Wi-Fi, AC, TV
105	32	192.00	3	City View	f	In Repair	AC, TV, Balcony, Wi-Fi
106	33	157.00	2	City View	t	Damaged	TV, Wi-Fi, Balcony
107	33	228.00	2	Sea View	t	Damaged	TV, Balcony, Mini Bar, Wi-Fi
108	33	247.00	1	Mountain View	t	Damaged	Balcony, Mini Bar, AC
109	33	242.00	1	Mountain View	t	In Repair	Balcony, Wi-Fi, Mini Bar, TV
110	33	314.00	2	City View	f	Damaged	Mini Bar, Wi-Fi, TV, Balcony
111	34	282.00	2	Mountain View	f	In Repair	Balcony, AC, Wi-Fi, Mini Bar
112	34	281.00	2	Mountain View	t	Good Condition	Mini Bar, Balcony
113	34	308.00	2	City View	f	Good Condition	TV, Mini Bar, Wi-Fi
114	34	223.00	1	Sea View	t	Damaged	Wi-Fi, AC, TV
115	34	176.00	3	City View	f	Damaged	Balcony, Mini Bar, Wi-Fi
116	35	278.00	1	Mountain View	f	Good Condition	TV, Balcony, AC
117	35	221.00	2	City View	t	Damaged	TV, AC
118	35	168.00	2	Mountain View	f	In Repair	Balcony, TV, Mini Bar
119	35	293.00	2	Sea View	t	In Repair	AC, Wi-Fi, Balcony
120	35	210.00	3	City View	t	In Repair	Mini Bar, TV, AC, Balcony
121	36	298.00	3	Mountain View	f	Damaged	Mini Bar, Balcony, TV, Wi-Fi
122	36	157.00	2	Mountain View	t	In Repair	Mini Bar, AC, Wi-Fi
123	36	164.00	1	Sea View	t	Damaged	AC, Mini Bar, Wi-Fi
124	36	248.00	2	City View	f	Damaged	TV, Mini Bar
125	36	155.00	1	Mountain View	t	Damaged	Mini Bar, Wi-Fi, Balcony
126	37	277.00	3	Sea View	f	In Repair	AC, TV, Mini Bar, Balcony
127	37	178.00	2	City View	f	In Repair	TV, Wi-Fi, AC, Mini Bar
128	37	150.00	2	Mountain View	f	In Repair	Balcony, Mini Bar
129	37	253.00	1	City View	f	Damaged	Balcony, AC, TV
130	37	167.00	3	Mountain View	t	In Repair	Wi-Fi, AC, Balcony
131	38	317.00	2	Mountain View	f	In Repair	Mini Bar, AC, Wi-Fi
132	38	273.00	3	Sea View	f	Damaged	Mini Bar, Wi-Fi, AC, TV
133	38	142.00	1	Mountain View	f	Damaged	Balcony, AC, Wi-Fi
134	38	194.00	2	Mountain View	f	Damaged	AC, Wi-Fi, Mini Bar, Balcony
135	38	271.00	1	Sea View	t	In Repair	AC, TV, Balcony, Mini Bar
136	39	196.00	2	City View	f	Good Condition	Wi-Fi, AC, Mini Bar, TV
137	39	194.00	3	Mountain View	f	In Repair	TV, AC, Mini Bar, Balcony
138	39	278.00	3	Mountain View	f	Good Condition	AC, TV, Mini Bar, Balcony
139	39	158.00	1	City View	t	In Repair	Wi-Fi, Balcony
140	39	295.00	1	Mountain View	t	In Repair	AC, Balcony
141	40	144.00	3	City View	t	Damaged	Balcony, TV, Mini Bar
142	40	312.00	1	City View	t	In Repair	Wi-Fi, Balcony
143	40	244.00	1	Mountain View	f	Good Condition	Wi-Fi, AC, TV, Balcony
144	40	289.00	3	City View	t	Good Condition	TV, Wi-Fi, Mini Bar
145	40	239.00	3	Sea View	f	Damaged	TV, Mini Bar, AC
146	41	289.00	3	Mountain View	t	Good Condition	Mini Bar, Wi-Fi, AC, TV
147	41	164.00	2	Mountain View	f	Good Condition	TV, Balcony, Wi-Fi
148	41	279.00	2	City View	t	In Repair	Wi-Fi, TV, AC, Mini Bar
149	41	277.00	2	Mountain View	f	Good Condition	Mini Bar, Wi-Fi
150	41	169.00	1	City View	t	In Repair	Wi-Fi, AC
151	42	272.00	1	Mountain View	f	Good Condition	Balcony, Wi-Fi, AC, TV
152	42	261.00	1	City View	t	In Repair	Wi-Fi, Balcony, AC
153	42	297.00	3	Sea View	f	Damaged	AC, Wi-Fi
154	42	295.00	1	City View	f	Good Condition	AC, TV, Wi-Fi, Mini Bar
155	42	258.00	2	Mountain View	t	In Repair	Mini Bar, Wi-Fi, TV, Balcony
156	43	213.00	2	Sea View	f	In Repair	AC, Balcony, TV
157	43	258.00	2	Sea View	f	Good Condition	Mini Bar, Balcony
158	43	291.00	3	Sea View	f	In Repair	Wi-Fi, Balcony
159	43	163.00	2	Sea View	f	In Repair	Balcony, TV, Mini Bar, AC
160	43	273.00	2	Mountain View	f	Good Condition	AC, Mini Bar, Wi-Fi
161	44	187.00	3	City View	f	Damaged	Wi-Fi, AC
162	44	286.00	3	Sea View	f	In Repair	TV, Wi-Fi, Mini Bar, Balcony
163	44	223.00	2	Sea View	f	Good Condition	Balcony, Wi-Fi
164	44	236.00	2	Mountain View	f	In Repair	TV, AC, Wi-Fi, Balcony
165	44	223.00	3	Mountain View	f	Damaged	TV, Mini Bar, AC, Wi-Fi
166	45	151.00	2	City View	f	In Repair	Balcony, TV
167	45	159.00	2	City View	t	Good Condition	Wi-Fi, Balcony
168	45	256.00	2	Sea View	f	In Repair	AC, Wi-Fi, Mini Bar
169	45	275.00	2	Sea View	t	In Repair	Balcony, AC, Wi-Fi
170	45	169.00	3	Mountain View	t	In Repair	Mini Bar, TV, AC, Wi-Fi
171	46	304.00	2	City View	t	Damaged	TV, Mini Bar, AC, Wi-Fi
172	46	230.00	2	City View	t	Good Condition	AC, Mini Bar
173	46	161.00	1	Sea View	t	Damaged	Wi-Fi, Balcony, Mini Bar, TV
174	46	183.00	3	Sea View	t	Damaged	AC, Mini Bar, TV
175	46	269.00	3	Sea View	t	Damaged	Balcony, Wi-Fi, Mini Bar
176	47	306.00	1	City View	t	Good Condition	Wi-Fi, AC
177	47	252.00	2	City View	t	In Repair	AC, Mini Bar
178	47	276.00	2	City View	t	In Repair	AC, Wi-Fi
179	47	195.00	1	City View	t	Good Condition	AC, Wi-Fi, TV
180	47	321.00	1	Mountain View	t	In Repair	Balcony, TV, Wi-Fi, AC
181	48	251.00	1	City View	f	In Repair	Wi-Fi, Balcony
182	48	151.00	3	Sea View	f	In Repair	TV, Wi-Fi
183	48	264.00	1	Sea View	f	In Repair	Balcony, Wi-Fi, Mini Bar
184	48	245.00	1	Mountain View	f	Good Condition	Wi-Fi, Mini Bar, AC
185	48	316.00	1	Sea View	t	In Repair	Balcony, Mini Bar, AC, TV
186	49	215.00	1	Mountain View	t	In Repair	AC, TV, Wi-Fi, Balcony
187	49	175.00	3	Sea View	t	In Repair	Balcony, TV, Mini Bar, AC
188	49	271.00	1	Mountain View	f	Good Condition	Mini Bar, Balcony, AC
189	49	158.00	1	City View	t	In Repair	Wi-Fi, Balcony
190	49	205.00	1	Sea View	t	In Repair	AC, Balcony, Wi-Fi, TV
191	50	228.00	3	Mountain View	t	In Repair	Balcony, AC, TV
192	50	149.00	2	Mountain View	t	Good Condition	Mini Bar, Wi-Fi
193	50	236.00	2	Sea View	f	In Repair	Wi-Fi, Mini Bar, AC, Balcony
194	50	145.00	2	Mountain View	f	Damaged	Mini Bar, Wi-Fi
195	50	306.00	2	Mountain View	t	Good Condition	Balcony, TV, Wi-Fi, AC
196	11	200.00	1	Sea View	t	Good Condition	AC, TV, Wi-Fi
197	11	250.00	2	Mountain View	t	Good Condition	AC, TV, Wi-Fi, Mini Bar
198	11	300.00	3	City View	f	Good Condition	AC, TV, Wi-Fi, Balcony
199	11	180.00	1	Sea View	t	In Repair	AC, TV
200	11	150.00	2	Mountain View	f	Damaged	AC, TV
201	12	220.00	1	Mountain View	t	Good Condition	AC, TV, Wi-Fi
202	12	270.00	2	City View	t	Good Condition	AC, TV, Wi-Fi, Mini Bar
203	12	330.00	3	Sea View	f	Good Condition	AC, TV, Wi-Fi, Balcony
204	12	200.00	1	City View	t	In Repair	AC, TV
205	12	180.00	2	Mountain View	f	Damaged	AC, TV
206	13	210.00	1	Sea View	t	Good Condition	AC, TV, Wi-Fi
207	13	260.00	2	Mountain View	t	Good Condition	AC, TV, Wi-Fi, Mini Bar
208	13	290.00	3	City View	f	Good Condition	AC, TV, Wi-Fi, Balcony
209	13	190.00	1	Sea View	t	In Repair	AC, TV
210	13	170.00	2	Mountain View	f	Damaged	AC, TV
211	14	180.00	1	Sea View	t	Good Condition	AC, TV, Wi-Fi
212	14	230.00	2	Mountain View	t	Good Condition	AC, TV, Wi-Fi, Mini Bar
213	14	270.00	3	City View	f	Good Condition	AC, TV, Wi-Fi, Balcony
214	14	160.00	1	Sea View	t	In Repair	AC, TV
215	14	140.00	2	Mountain View	f	Damaged	AC, TV
216	15	210.00	1	Sea View	t	Good Condition	AC, TV, Wi-Fi
217	15	260.00	2	Mountain View	t	Good Condition	AC, TV, Wi-Fi, Mini Bar
218	15	300.00	3	City View	f	Good Condition	AC, TV, Wi-Fi, Balcony
219	15	190.00	1	Sea View	t	In Repair	AC, TV
220	15	170.00	2	Mountain View	f	Damaged	AC, TV
222	6	999.00	2	Mountain View	f	Damaged	
\.


--
-- Name: archived_records_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.archived_records_record_id_seq', 16, true);


--
-- Name: employee_employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.employee_employee_id_seq', 13, true);


--
-- Name: guest_guest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.guest_guest_id_seq', 13, true);


--
-- Name: hotel_hotel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.hotel_hotel_id_seq', 51, true);


--
-- Name: hotelchain_chain_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.hotelchain_chain_id_seq', 17, true);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 8, true);


--
-- Name: rental_rental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rental_rental_id_seq', 12, true);


--
-- Name: reservation_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.reservation_reservation_id_seq', 55, true);


--
-- Name: room_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.room_room_id_seq', 222, true);


--
-- Name: archived_records archived_records_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.archived_records
    ADD CONSTRAINT archived_records_pkey PRIMARY KEY (record_id);


--
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);


--
-- Name: employee employee_sin_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_sin_key UNIQUE (sin);


--
-- Name: guest guest_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.guest
    ADD CONSTRAINT guest_pkey PRIMARY KEY (guest_id);


--
-- Name: guest guest_sin_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.guest
    ADD CONSTRAINT guest_sin_key UNIQUE (sin);


--
-- Name: hotel hotel_contact_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT hotel_contact_email_key UNIQUE (contact_email);


--
-- Name: hotel hotel_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT hotel_pkey PRIMARY KEY (hotel_id);


--
-- Name: hotelchain hotelchain_contact_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotelchain
    ADD CONSTRAINT hotelchain_contact_email_key UNIQUE (contact_email);


--
-- Name: hotelchain hotelchain_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotelchain
    ADD CONSTRAINT hotelchain_pkey PRIMARY KEY (chain_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: rental rental_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_pkey PRIMARY KEY (rental_id);


--
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (reservation_id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (room_id);


--
-- Name: idx_hotel_name; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_hotel_name ON public.hotel USING btree (name);


--
-- Name: idx_reservation_status; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_reservation_status ON public.reservation USING btree (status);


--
-- Name: idx_room_price; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_room_price ON public.room USING btree (price);


--
-- Name: employee employee_hotel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES public.hotel(hotel_id) ON DELETE CASCADE;


--
-- Name: hotel hotel_chain_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hotel
    ADD CONSTRAINT hotel_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES public.hotelchain(chain_id) ON DELETE CASCADE;


--
-- Name: payment payment_rental_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_rental_id_fkey FOREIGN KEY (rental_id) REFERENCES public.rental(rental_id) ON DELETE CASCADE;


--
-- Name: rental rental_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);


--
-- Name: rental rental_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.guest(guest_id);


--
-- Name: rental rental_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservation(reservation_id) ON DELETE CASCADE;


--
-- Name: rental rental_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id);


--
-- Name: reservation reservation_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.guest(guest_id);


--
-- Name: reservation reservation_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id);


--
-- Name: room room_hotel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES public.hotel(hotel_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

