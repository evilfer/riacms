--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.7
-- Dumped by pg_dump version 9.5.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: action; Type: TABLE; Schema: public;
--

CREATE TABLE action (
    aid integer NOT NULL,
    ts timestamp with time zone DEFAULT now() NOT NULL,
    eid integer,
    vid integer,
    uid integer,
    type character varying(255)
);

--
-- Name: action_aid_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE action_aid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: entity; Type: TABLE; Schema: public;
--

CREATE TABLE entity (
    eid integer NOT NULL,
    vid integer,
    type character varying(255)
);

--
-- Name: entity_eid_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE entity_eid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




CREATE TABLE sessions (
    sid character varying(255) NOT NULL,
    sess json NOT NULL,
    expired timestamp with time zone NOT NULL
);


--
-- Name: version; Type: TABLE; Schema: public;
--

CREATE TABLE version (
    eid integer NOT NULL,
    vid integer NOT NULL,
    aid integer,
    data jsonb
);

--
-- Name: aid; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY action ALTER COLUMN aid SET DEFAULT nextval('action_aid_seq'::regclass);


--
-- Name: eid; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY entity ALTER COLUMN eid SET DEFAULT nextval('entity_eid_seq'::regclass);


--
-- Name: action_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY action
    ADD CONSTRAINT action_pkey PRIMARY KEY (aid);


--
-- Name: entity_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY entity
    ADD CONSTRAINT entity_pkey PRIMARY KEY (eid);


--
-- Name: sessions_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: version_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY version
    ADD CONSTRAINT version_pkey PRIMARY KEY (eid, vid);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

