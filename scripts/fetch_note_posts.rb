#!/usr/bin/env ruby
# frozen_string_literal: true

# note.com の RSS を取得して _data/note_posts.json に書き出す。
#
#   bundle exec ruby scripts/fetch_note_posts.rb [username]
#
# - ユーザー名は引数、環境変数 NOTE_USERNAME、_config.yml の note.username の順で決める
# - 取得に失敗した場合は既存の JSON を残して正常終了する（ビルドを止めない）
# - 出力は GitHub Actions のビルド前に実行し、ローカルでも同じコマンドで更新できる

require "net/http"
require "uri"
require "json"
require "time"
require "rexml/document"
require "yaml"
require "cgi"

ROOT = File.expand_path("..", __dir__)
OUTPUT = File.join(ROOT, "_data", "note_posts.json")

def username
  return ARGV[0] unless ARGV[0].to_s.empty?
  return ENV["NOTE_USERNAME"] unless ENV["NOTE_USERNAME"].to_s.empty?

  config = YAML.safe_load(File.read(File.join(ROOT, "_config.yml")), aliases: true)
  config.dig("note", "username") or abort("note.username が _config.yml にありません")
end

def fetch(url, limit = 5)
  raise "リダイレクトが多すぎます" if limit.zero?

  uri = URI(url)
  res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https", open_timeout: 10, read_timeout: 20) do |http|
    http.get(uri.request_uri, { "User-Agent" => "satoryu.com site builder (+https://www.satoryu.com)" })
  end
  case res
  when Net::HTTPSuccess then res.body
  when Net::HTTPRedirection then fetch(URI.join(url, res["location"]).to_s, limit - 1)
  else raise "HTTP #{res.code} #{url}"
  end
end

def plain_summary(html, length = 120)
  text = html.to_s
               .gsub(%r{<a[^>]*>続きをみる</a>}, "")
               .gsub(%r{<figure.*?</figure>}m, "")
               .gsub(/<[^>]+>/, " ")
  text = CGI.unescapeHTML(text).gsub(/\s+/, " ").strip
  text.length > length ? "#{text[0, length]}…" : text
end

def parse(xml)
  doc = REXML::Document.new(xml)
  doc.elements.to_a("rss/channel/item").map do |item|
    thumb = item.elements["media:thumbnail"]&.text.to_s.strip
    {
      "title" => item.elements["title"]&.text.to_s.strip,
      "url" => item.elements["link"]&.text.to_s.strip,
      "date" => Time.parse(item.elements["pubDate"].text).iso8601,
      "summary" => plain_summary(item.elements["description"]&.text),
      "image" => thumb.empty? ? nil : thumb
    }
  end
end

name = username
begin
  items = parse(fetch("https://note.com/#{name}/rss"))
  raise "記事が 0 件でした" if items.empty?

  data = {
    "username" => name,
    "profile_url" => "https://note.com/#{name}",
    "fetched_at" => Time.now.utc.iso8601,
    "items" => items
  }
  File.write(OUTPUT, JSON.pretty_generate(data) + "\n")
  puts "note: #{items.size} 件を #{OUTPUT} に書き出しました"
rescue StandardError => e
  warn "note: 取得に失敗しました（#{e.message}）"
  if File.exist?(OUTPUT)
    warn "note: 既存の #{OUTPUT} をそのまま使います"
  else
    File.write(OUTPUT, JSON.pretty_generate({ "username" => name, "profile_url" => "https://note.com/#{name}", "fetched_at" => nil, "items" => [] }) + "\n")
    warn "note: 空のデータを書き出しました"
  end
end
