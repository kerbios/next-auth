import { collections, FaunaAdapter, format, indexes, query } from "../src"
import { Client as FaunaClient, Get, Match, Ref } from "faunadb"

const client = new FaunaClient({
  secret: "secret",
  scheme: "http",
  domain: "localhost",
  port: 8443,
})

const q = query(client, format.from)
